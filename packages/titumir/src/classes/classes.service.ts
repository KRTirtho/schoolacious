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
import { NotificationService } from "../notification/notification.service";
import { StudentSectionGradeService } from "../student-section-grade/student-section-grade.service";
import { NOTIFICATION_INDICATOR_ICON } from "@schoolacious/types";
import { OpenViduService } from "../open-vidu/open-vidu.service";

export type CreateClassPayload = PartialKey<Class, "_id" | "created_at" | "sessionId">;

export type CurrentClassTimeMeta = Pick<Class, "duration" | "time">;

@Injectable()
export class ClassesService extends BasicEntityService<Class, CreateClassPayload> {
    logger = new Logger(ClassesService.name);
    constructor(
        private schedularRegistry: SchedulerRegistry,
        @InjectRepository(Class) classRepo: Repository<Class>,
        private notificationService: NotificationService,
        private ssgService: StudentSectionGradeService,
        private openviduService: OpenViduService,
    ) {
        super(classRepo);
    }

    async validateHostClass({
        host,
        day,
        duration,
        time,
    }: Omit<ScheduleClassDto, "date"> & { day: number; time: string }): Promise<boolean> {
        // host will have classes on other sections/grade-sections. Thus
        // ensuring host gets a break after every class
        const hostClasses = await this.find(
            { host: { user: { _id: host } }, day },
            {
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
            { host: { section }, day },
            { relations: ["host", "host.section"] },
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
            { day: today, host: { grade: { school: school_id } } },
            {
                relations: ["host", "host.section", "host.grade", "host.user"],
            },
        );
        const studentsOfGrades = await this.ssgService.find(
            { section: In(classes.map((c) => c.host.section._id)) },
            {
                relations: ["user"],
            },
        );

        for (const { _id, time, day, host } of classes) {
            const [hour, minute, second] = time.split(":");
            const expression = cronFromObj({
                day,
                hour,
                minute,
                second,
            });
            const classJob = new CronJob(expression, async () => {
                try {
                    const twentyFourHr = format(
                        parse(time, "HH:mm:ss", new Date()),
                        "hh:mm a",
                    );
                    // Creating openvidu session for the class
                    const session = await this.openviduService.createSession();

                    await this.update({ _id }, { sessionId: session.sessionId });

                    // TODO: Store the notification for valid students of grade's
                    const notificationsPayload = studentsOfGrades.map(({ user }) => ({
                        owner_id: _id,
                        receiver: user,
                        title: "Scheduled Class started",
                        description: `Class by ${host.user.first_name} ${host.user.last_name} has started from ${twentyFourHr}`,
                        open_link: `/class/${host.grade.standard}/${host.section.name}/${session.sessionId}`,
                        type_indicator_icon: NOTIFICATION_INDICATOR_ICON.classStarted,
                        avatar_url:
                            "N/A will be available when cloud storage will be added",
                    }));
                    const createdNotifications = await this.notificationService.create(
                        notificationsPayload,
                    );

                    await Promise.all(
                        createdNotifications.map((notification) =>
                            this.notificationService.sendNotification(
                                notification.receiver._id,
                                notification,
                            ),
                        ),
                    );

                    // TODO: Not active? Send Push notification
                } catch (error) {
                    this.logger.error(error);
                    throw error;
                }
            });
            const classJobId = individualClassJob(_id);
            if (!this.schedularRegistry.doesExists("cron", classJobId)) {
                this.schedularRegistry.addCronJob(classJobId, classJob);
                classJob.start();
                this.logger.log(
                    `Scheduled individual:class ${_id} | ${classJob.nextDates()} | ${
                        classJob.running
                    }`,
                );
            }
        }
    }
}
