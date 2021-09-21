import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import BasicEntityService, {
    PartialKey,
} from "../database/abstracts/entity-service.abstract";
import Class from "../database/entity/classes.entity";
import {
    differenceInMinutes,
    parse,
    getDay,
    addSeconds,
    isAfter,
    isEqual,
    secondsToMinutes,
    format,
} from "date-fns";
import ScheduleClassDto from "./dto/schedule-class.dto";
import Section from "../database/entity/sections.entity";
import { cronFromObj, individualClassJob } from "../utils/cron-names.util";
import { CronJob } from "cron";
import { SchedulerRegistry } from "@nestjs/schedule";
import { NotificationGateway } from "../notification/notification.gateway";
import { NotificationService } from "../notification/notification.service";
import { StudentSectionGradeService } from "../section/student-section-grade.service";
import { NOTIFICATION_STATUS } from "@veschool/types";

export type CreateClassPayload = PartialKey<Class, "_id" | "created_at">;

export type CurrentClassTimeMeta = Pick<Class, "duration" | "time">;

@Injectable()
export class ClassesService extends BasicEntityService<Class, CreateClassPayload> {
    logger = new Logger(ClassesService.name);
    constructor(
        private schedularRegistry: SchedulerRegistry,
        @InjectRepository(Class) private classRepo: Repository<Class>,
        private notificationGateway: NotificationGateway,
        private notificationService: NotificationService,

        private ssgService: StudentSectionGradeService,
    ) {
        super(classRepo);
    }

    async validateHostClass({
        host,
        day,
        duration,
        time,
    }: ScheduleClassDto): Promise<boolean> {
        // host will have classes on other sections/grade-sections. Thus
        // ensuring host gets a break after every class
        const hostClasses = await this.find(
            {},
            {
                where: { host: { user: { _id: host } }, day },
                relations: ["host", "host.user"],
            },
        );
        return await this.validateClasses(hostClasses, { duration, time });
    }

    async validateStudentClass(
        section: Section,
        day: number,
        current: CurrentClassTimeMeta,
    ) {
        const studentClasses = await this.find(
            {},
            { where: { host: { section }, day }, relations: ["host", "host.section"] },
        );
        return this.validateClasses(studentClasses, current);
    }

    private async validateClasses(classes: Class[], current: CurrentClassTimeMeta) {
        if (classes.length === 0) return true;
        else if (classes.length >= 6) return false;

        return classes.every(({ time, duration }) => {
            const format = "HH:mm:ss";

            const parsedTime = parse(time, format, new Date());
            const parsedCurrentTime = parse(current.time, format, new Date());
            if (isEqual(parsedTime, parsedCurrentTime)) return false;
            const diff = isAfter(parsedCurrentTime, parsedTime)
                ? differenceInMinutes(parsedCurrentTime, parsedTime)
                : differenceInMinutes(parsedTime, parsedCurrentTime);

            const endTime = addSeconds(parsedTime, duration);
            const endCurrentTime = addSeconds(parsedCurrentTime, current.duration);
            const endDiff = isAfter(endTime, endCurrentTime)
                ? differenceInMinutes(endTime, endCurrentTime)
                : differenceInMinutes(endCurrentTime, endTime);

            if (
                !(
                    diff - secondsToMinutes(duration) >= 10 &&
                    endDiff - secondsToMinutes(current.duration) >= 10
                )
            )
                return false;

            return true;
        });
    }

    // this method will create  will appropriately
    // schedule other descendent cronjob for a day
    async createClassCronJob(school_id: string) {
        // checking for todays valid cronjob
        const today = getDay(new Date());
        const classes = await this.find(
            {},
            {
                where: {
                    day: today,
                    host: { grade: { school: school_id } },
                },
                relations: ["host", "host.section", "host.grade"],
            },
        );
        const studentsOfGrades = await this.ssgService.find(
            {},
            {
                where: {
                    section: In(classes.map((c) => c.host.section._id)),
                },
                relations: ["user"],
            },
        );

        for (const { _id, time, day } of classes) {
            const [hour, minute, second] = time.split(":");
            const expression = cronFromObj({
                day,
                hour,
                minute,
                second,
            });
            const job = new CronJob(expression, async () => {
                const twentyFourHr = format(
                    parse(time, "HH:mm:ss", new Date()),
                    "hh:mm a",
                );
                // TODO: Store the notification for valid students of grade's
                const notificationsPayload = studentsOfGrades.map(({ user }) => ({
                    user,
                    message: `Class is about to start in ${twentyFourHr}`,
                    src: "class",
                    status: NOTIFICATION_STATUS.unread,
                }));
                const createdNotifications = await this.notificationService.create(
                    notificationsPayload,
                );
                // TODO: Active? Send WS notifications
                this.notificationGateway.sendNotification();
                // TODO: Check if user active
                // use user's 'status' to check if its 'online' or
                // 'offline' implement custom websocket event which will
                // be sent from the client each time the client comes
                // online
                this.notificationGateway.server;
                // TODO: Not active? Send Push notification
            });
            const jobId = individualClassJob(_id);
            if (!this.schedularRegistry.doesExists("cron", jobId)) {
                this.schedularRegistry.addCronJob(jobId, job);
                job.start();
                this.logger.log(
                    `Scheduled individual:class ${_id} | ${job.nextDates()} | ${
                        job.running
                    }`,
                );
            }
        }
    }
}
