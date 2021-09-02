import { Body, Controller, Get, Inject, Logger, Param, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import User from "../database/entity/users.entity";
import { USER_ROLE } from "@veschool/types";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import CreateSubjectDTO from "./dto/create-subject.dto";
import defaultSubjects from "./static/default-subjects";
import { SubjectService } from "./subject.service";
import School from "../database/entity/schools.entity";

export type VerifiedSchoolUser = Omit<User, "school"> & { school: School };

@Controller("/school/:school/subject")
@ApiBearerAuth()
export class SubjectController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
        private readonly subjectService: SubjectService,
    ) {
        this.logger.setContext(SubjectController.name);
    }

    @Get("defaults")
    @VerifySchool()
    getDefaultSubjects(@Param("school") _?: number) {
        return defaultSubjects;
    }

    @Get()
    @VerifySchool()
    async getAlSubject(
        @CurrentUser() user: VerifiedSchoolUser,
        @Param("school") _?: number,
    ) {
        try {
            return await this.subjectService.find({ school: user.school });
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Post()
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    async createSubject(
        @Body()
        body: CreateSubjectDTO,
        @CurrentUser() user: VerifiedSchoolUser,
        @Param("school") _?: number,
    ) {
        try {
            const subject = await this.subjectService.create({
                ...body,
                school: user.school,
            });
            Object.assign(subject.school, null);
            return subject;
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }
}
