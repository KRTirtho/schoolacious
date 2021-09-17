import {
    Body,
    Controller,
    ParseArrayPipe,
    Post,
    NotAcceptableException,
    Logger,
    Inject,
    Param,
    ParseIntPipe,
    Get,
} from "@nestjs/common";
import ScheduleClassDTO from "./dto/schedule-class.dto";
import { Roles } from "../decorator/roles.decorator";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import { USER_ROLE, CLASS_STATUS } from "@veschool/types";
import { ClassesService } from "./classes.service";
import { VerifiedGradeUser } from "../grade/grade.controller";
import { CurrentUser } from "../decorator/current-user.decorator";
import { SectionService } from "../section/section.service";
import { TeacherSectionGradeService } from "../section/teacher-section-grade.service";
import { classJob } from "../utils/cron-names.util";
import { CronJob } from "cron";
import {
    ApiBearerAuth,
    ApiBody,
    ApiNotAcceptableResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiParam,
} from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { VerifySchool } from "../decorator/verify-school.decorator";

@Controller("/school/:school/grade/:grade/section/:section/class")
@ApiBearerAuth()
export class ClassesController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
        private classesService: ClassesService,
        private scheduleRegistry: SchedulerRegistry,
        private sectionService: SectionService,
        private tsgService: TeacherSectionGradeService,
    ) {
        this.logger.setContext(ClassesController.name);
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
            this.logger.error(error?.message);
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
            if (!this.scheduleRegistry.doesExists("cron", classJob(user.school._id))) {
                const schoolClassJob = new CronJob(
                    CronExpression.EVERY_DAY_AT_6AM,
                    async () =>
                        await this.classesService.createClassCronJob(user.grade._id),
                );
                this.scheduleRegistry.addCronJob(
                    classJob(user.school._id),
                    schoolClassJob,
                );
            }
            return { message: "successfully scheduled classes" };
        } catch (error) {
            this.logger.error(error?.message ?? "");
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
            if (!this.scheduleRegistry.doesExists("cron", classJob(user.school._id))) {
                const schoolClassJob = new CronJob(
                    CronExpression.EVERY_DAY_AT_6AM,
                    async () =>
                        await this.classesService.createClassCronJob(user.grade._id),
                );
                this.scheduleRegistry.addCronJob(
                    classJob(user.school._id),
                    schoolClassJob,
                );
            }
            Object.assign(scheduledClass.host, {
                ...scheduledClass.host,
                grade: undefined,
                section: undefined,
            });
            return scheduledClass;
        } catch (error) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }
}
