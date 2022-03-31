import {
    Body,
    Controller,
    Post,
    NotAcceptableException,
    Param,
    ParseIntPipe,
    Get,
    OnApplicationBootstrap,
    Logger,
    ForbiddenException,
    NotFoundException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import ScheduleClassDTO from "./dto/schedule-class.dto";
import { Roles } from "../decorator/roles.decorator";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import { USER_ROLE, CLASS_STATUS } from "@schoolacious/types";
import { ClassesService } from "./classes.service";
import { VerifiedGradeUser } from "../grade/grade.controller";
import { CurrentUser } from "../decorator/current-user.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import { SchoolService } from "../school/school.service";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { classJob } from "../utils/cron-names.util";
import { OpenViduService } from "../open-vidu/open-vidu.service";
import { OpenViduRole } from "openvidu-node-client";
import { localDateToDayTime } from "../utils/local-date-to-day-time.utils";
import { TeacherSectionGradeService } from "../teacher-section-grade/teacher-section-grade.service";
import { StudentSectionGradeService } from "../student-section-grade/student-section-grade.service";

@Controller("/school/:school/grade/:grade/section/:section/class")
@ApiBearerAuth()
export class ClassesController implements OnApplicationBootstrap {
    logger = new Logger(ClassesController.name);
    constructor(
        private classesService: ClassesService,
        private tsgService: TeacherSectionGradeService,
        private schoolService: SchoolService,
        private scheduleRegistry: SchedulerRegistry,
        private openviduService: OpenViduService,
        private ssgService: StudentSectionGradeService,
    ) {}
    async onApplicationBootstrap() {
        const schools = await this.schoolService.find();
        for (const { _id, short_name } of schools) {
            if (!this.scheduleRegistry.doesExists("cron", classJob(_id))) {
                this.createSchoolClassJob(_id);
                this.logger.log(`starting class-job for school "${short_name}"`);
            }
        }
    }

    createSchoolClassJob(school_id: string) {
        // creating a "school-global" cron job
        const schoolClassJob = new CronJob({
            cronTime: CronExpression.EVERY_DAY_AT_6AM,
            onTick: async () => {
                await this.classesService.createClassCronJob(school_id);
            },
            // running the create individual class job on init to ensure no
            // class get missed for scheduling before class-job's
            // next-time check
            runOnInit: true,
        });
        this.scheduleRegistry.addCronJob(classJob(school_id), schoolClassJob);
    }

    @Get()
    @VerifySchool()
    @ApiParam({ name: "school" })
    async getClasses(
        @Param("section") sectionName: string,
        @Param("grade", ParseIntPipe) standard: number,
    ) {
        try {
            const classes = await this.classesService.find(
                {
                    host: {
                        section: { name: sectionName },
                        grade: { standard },
                    },
                },
                {
                    relations: [
                        "host",
                        "host.section",
                        "host.grade",
                        "host.subject",
                        "host.user",
                    ],
                },
            );

            return classes.map((c) => ({
                ...c,
                host: { ...c.host, section: undefined, grade: undefined },
            }));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Post()
    @VerifyGrade()
    @Roles(
        USER_ROLE.admin,
        USER_ROLE.coAdmin,
        USER_ROLE.gradeModerator,
        USER_ROLE.classTeacher,
    )
    @ApiParam({ name: "school" })
    async addClass(
        @CurrentUser() user: VerifiedGradeUser,
        @Body() { date, ...body }: ScheduleClassDTO,
        @Param("section") sectionName: string,
        @Param("grade", ParseIntPipe) standard: number,
    ) {
        try {
            const host = await this.tsgService.findOne(
                {
                    user: { _id: body.host },
                    section: { name: sectionName },
                    grade: { standard },
                },
                { relations: ["section", "user", "grade", "subject"] },
            );

            const { day, time } = localDateToDayTime(new Date(date));

            const [isValidHostClass, isValidStudentClass] = await Promise.all([
                this.classesService.validateHostClass({ ...body, time, day }),
                this.classesService.validateStudentClass(host.section, day, {
                    ...body,
                    time,
                }),
            ]);
            if (!isValidHostClass)
                throw new NotAcceptableException(
                    "minimum break duration (10mins) or 6-class/day not followed for hosts",
                );
            if (!isValidStudentClass)
                throw new NotAcceptableException(
                    "minimum break duration (10mins) or 6-class/day not followed for students",
                );
            const scheduledClass = await this.classesService.create({
                ...body,
                day,
                time,
                host,
                status: CLASS_STATUS.scheduled,
            });

            Object.assign(scheduledClass.host, {
                ...scheduledClass.host,
                grade: undefined,
                section: undefined,
            });

            if (!this.scheduleRegistry.doesExists("cron", classJob(user.school._id)))
                this.createSchoolClassJob(user.school._id);
            await this.classesService.createClassCronJob(user.school._id);
            return scheduledClass;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get(":sessionId")
    @ApiParam({ name: "school" })
    @ApiParam({ name: "grade" })
    @ApiParam({ name: "section" })
    async joinSession(
        @Param("sessionId") sessionId: string,
        @CurrentUser() user: VerifiedGradeUser,
        @Param("grade", ParseIntPipe) standard: number,
        @Param("section") sectionName: string,
    ) {
        try {
            const session = this.openviduService.activeSessions.find(
                (session) => session.sessionId === sessionId,
            );
            if (!session)
                throw new NotFoundException(
                    `${sessionId} session not found or has expired`,
                );
            const theClass = await this.classesService.findOne(
                { sessionId },
                { relations: ["host", "host.user"] },
            );
            // checking if user is the host & doing operation accordingly
            if (theClass.host.user._id === user._id) {
                const connection = await session.createConnection({
                    role: OpenViduRole.MODERATOR,
                });

                return {
                    token: connection.token,
                    subscribers: connection.subscribers,
                    publishers: connection.publishers,
                    createdAt: connection.createdAt,
                };
            }
            // checking the user is a student & belongs to this class/grade
            const ssg = await this.ssgService.findOne(
                {
                    user,
                    section: { name: sectionName, grade: { standard } },
                },
                { relations: ["section", "user", "section.grade"] },
            );

            if (ssg) {
                const connection = await session.createConnection({
                    role: OpenViduRole.PUBLISHER,
                });
                return {
                    token: connection.token,
                    createdAt: connection.createdAt,
                };
            } else
                throw new ForbiddenException("user doesn't belong to the class session");
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**@ignore */
    /**@development This route is only for development purposes for WebRTC conference UI  */
    @Get("dev/:sessionId")
    @ApiParam({ name: "school" })
    @ApiParam({ name: "grade" })
    @ApiParam({ name: "section" })
    async joinDevelopmentSession(@Param("sessionId") sessionId: string) {
        try {
            await this.openviduService.fetch();
            const session =
                this.openviduService.activeSessions.find(
                    (session) => session.sessionId === sessionId,
                ) ??
                (await this.openviduService.createSession({
                    customSessionId: sessionId,
                }));

            const connection = await session.createConnection({
                role: OpenViduRole.MODERATOR,
            });
            return connection;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
