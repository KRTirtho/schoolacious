import {
    Body,
    Controller,
    ParseArrayPipe,
    Post,
    NotAcceptableException,
    Logger,
    Inject,
} from "@nestjs/common";
import ScheduleClassDTO from "./dto/schedule-class.dto";
import { Roles } from "../decorator/roles.decorator";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import { USER_ROLE } from "../database/entity/users.entity";
import { ClassesService } from "./classes.service";
import { VerifiedGradeUser } from "../grade/grade.controller";
import { CurrentUser } from "../decorator/current-user.decorator";
import { SectionService } from "../section/section.service";
import { CLASS_STATUS } from "../database/entity/classes.entity";
import { TeacherSectionGradeService } from "../section/teacher-section-grade.service";
import { classJob } from "../utils/cron-names.util";
import { CronJob } from "cron";
import {
    ApiBearerAuth,
    ApiBody,
    ApiNotAcceptableResponse,
    ApiNotFoundResponse,
} from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Controller("/school/:school/grade/:grade/class")
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

    @Post()
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
    async addClasses(
        @CurrentUser() user: VerifiedGradeUser,
        @Body(new ParseArrayPipe({ items: ScheduleClassDTO })) body: ScheduleClassDTO[],
    ) {
        try {
            // TODO: Check host exists & is valid for section✔
            // TODO: Check host has other classes at those times✔
            // TODO: Check host gets enough break before class (5-10min)✔
            // TODO: Check each class has minimum 5-10mins break✔
            // TODO: Check class length per day (maximum allowed 6)✔
            // TODO: Check students are having minimum break✔

            // using loop to filter out the valid classes because in filter
            // or HOF invalid classes will get created && no way of
            // throwing error from within them
            const validClasses = [];

            for (const el of body) {
                const [host, section] = await Promise.all([
                    this.tsgService.findOne(
                        { _id: el.host },
                        { relations: ["section", "user"] },
                    ),
                    this.sectionService.findOne({
                        name: el.section_name,
                    }),
                ]);
                if (host.section._id !== section._id)
                    throw new NotAcceptableException(
                        "host isn't a valid teacher of the section",
                    );
                const [isValidHostClass, isValidStudentClass] = await Promise.all([
                    this.classesService.validateHostClass(el),
                    this.classesService.validateStudentClass(section, el.day),
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
                    host: host.user,
                    section,
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
}
