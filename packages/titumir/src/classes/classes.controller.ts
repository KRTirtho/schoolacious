import {
    Body,
    Controller,
    ParseArrayPipe,
    Post,
    NotAcceptableException,
    Param,
    ParseIntPipe,
    Get,
    OnApplicationBootstrap,
    Logger,
    ForbiddenException,
} from "@nestjs/common";
import ScheduleClassDTO from "./dto/schedule-class.dto";
import { Roles } from "../decorator/roles.decorator";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import { USER_ROLE, CLASS_STATUS } from "@veschool/types";
import { ClassesService } from "./classes.service";
import { VerifiedGradeUser } from "../grade/grade.controller";
import { CurrentUser } from "../decorator/current-user.decorator";
import { SectionService } from "../section/section.service";
import { TeacherSectionGradeService } from "../section/teacher-section-grade.service";
import {
    ApiBearerAuth,
    ApiBody,
    ApiNotAcceptableResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiParam,
} from "@nestjs/swagger";
import { VerifySchool } from "../decorator/verify-school.decorator";
import { SchoolService } from "../school/school.service";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { classJob } from "../utils/cron-names.util";
import { OpenViduService } from "../open-vidu/open-vidu.service";
import { ExtendUserRelation } from "../decorator/extend-user-relation.decorator";
import { OpenViduRole } from "openvidu-node-client";

@Controller("/school/:school/grade/:grade/section/:section/class")
@ApiBearerAuth()
export class ClassesController implements OnApplicationBootstrap {
    logger = new Logger(ClassesController.name);
    constructor(
        private classesService: ClassesService,
        private sectionService: SectionService,
        private tsgService: TeacherSectionGradeService,
        private schoolService: SchoolService,
        private scheduleRegistry: SchedulerRegistry,
        private openviduService: OpenViduService,
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
                {},
                {
                    where: {
                        host: {
                            section: { name: sectionName },
                            grade: { standard },
                        },
                    },
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

    /**
     * @deprecated in favor of new monolithic approach to scheduling
     * of classes
     */
    @Post("deprecated")
    @VerifyGrade()
    @Roles(
        USER_ROLE.admin,
        USER_ROLE.coAdmin,
        USER_ROLE.gradeModerator,
        USER_ROLE.classTeacher,
    )
    @ApiBody({ type: [ScheduleClassDTO] })
    @ApiNotAcceptableResponse({
        description: "non-section-teacher as host, minimum break durations not obeyed",
    })
    @ApiNotFoundResponse({
        description: "teacher not found in grade/section, section not found",
    })
    @ApiOperation({ deprecated: true })
    async addClasses(
        @CurrentUser() user: VerifiedGradeUser,
        @Body(new ParseArrayPipe({ items: ScheduleClassDTO })) body: ScheduleClassDTO[],
        @Param("section") sectionName: string,
        @Param("grade", ParseIntPipe) standard: number,
    ) {
        try {
            // Check host exists & is valid for section✔
            // Check host has other classes at those times✔
            // Check host gets enough break before class (5-10min)✔
            // Check each class has minimum 5-10mins break✔
            // Check class length per day (maximum allowed 6)✔
            // Check students are having minimum break✔

            // using loop to filter out the valid classes because in filter
            // or HOF invalid classes will get created && no way of
            // throwing error from within them
            const validClasses = [];

            for (const el of body) {
                const [host, section] = await Promise.all([
                    this.tsgService.findOne(
                        {
                            user: { _id: el.host },
                            section: { name: sectionName, grade: { standard } },
                        },
                        { relations: ["section", "user", "grade", "subject"] },
                    ),
                    this.sectionService.findOne(
                        {
                            name: sectionName,
                            grade: { standard },
                        },
                        { relations: ["grade"] },
                    ),
                ]);
                if (host.section._id !== section._id)
                    throw new NotAcceptableException(
                        "host isn't a valid teacher of the section",
                    );
                const [isValidHostClass, isValidStudentClass] = await Promise.all([
                    this.classesService.validateHostClass(el),
                    this.classesService.validateStudentClass(section, el.day, { ...el }),
                ]);

                if (!isValidHostClass)
                    throw new NotAcceptableException(
                        "minimum break duration (10mins) or 6-class/day not followed for hosts",
                    );
                if (!isValidStudentClass)
                    throw new NotAcceptableException(
                        "minimum break duration (10mins) or 6-class/day not followed for students",
                    );

                validClasses.push({
                    ...el,
                    host,
                    status: CLASS_STATUS.scheduled,
                });
            }

            await this.classesService.create(validClasses);
            return { message: "successfully scheduled classes" };
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
        @Body() body: ScheduleClassDTO,
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
            const [isValidHostClass, isValidStudentClass] = await Promise.all([
                this.classesService.validateHostClass(body),
                this.classesService.validateStudentClass(host.section, body.day, {
                    ...body,
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
    @VerifyGrade()
    @ExtendUserRelation(
        "studentsToSectionsToGrade",
        "studentsToSectionsToGrade.section",
        "studentsToSectionsToGrade.section.class_teacher",
    )
    @ApiParam({ name: "school" })
    @ApiParam({ name: "grade" })
    @ApiParam({ name: "section" })
    async joinSession(
        @Param("sessionId") sessionId: string,
        @CurrentUser() user: VerifiedGradeUser,
    ) {
        try {
            const session = this.openviduService.activeSessions.find(
                (session) => session.sessionId === sessionId,
            );
            const theClass = await this.classesService.findOne(
                { sessionId },
                { relations: ["host", "host.user"] },
            );
            // checking if user is the host & doing operation accordingly
            if (theClass.host.user._id === user._id) {
                const connection = await session?.createConnection({
                    role: OpenViduRole.MODERATOR,
                });

                return {
                    token: connection?.token,
                    subscribers: connection?.subscribers,
                    publishers: connection?.publishers,
                    createdAt: connection?.createdAt,
                };
            }
            // checking the user is a student & belongs to this class/grade
            const classTeacherIds = user.studentsToSectionsToGrade?.map(
                (ssg) => ssg.section.class_teacher?._id,
            );
            if (classTeacherIds?.includes(theClass.host.user._id)) {
                const connection = await session?.createConnection({
                    role: OpenViduRole.PUBLISHER,
                });
                return {
                    token: connection?.token,
                    createdAt: connection?.createdAt,
                };
            } else
                throw new ForbiddenException("user doesn't belong to the class session");
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
