import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";
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
    logger = new Logger(SubjectController.name);
    constructor(private readonly subjectService: SubjectService) {}
    @Get("defaults")
    @VerifySchool()
    @ApiParam({ name: "school" })
    getDefaultSubjects() {
        return defaultSubjects;
    }

    @Get()
    @VerifySchool()
    @ApiParam({ name: "school" })
    async getAlSubject(@CurrentUser() user: VerifiedSchoolUser) {
        try {
            return await this.subjectService.find(
                {},
                {
                    where: { school: user.school },
                    relations: ["grades_subjects", "grades_subjects.grade"],
                },
            );
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Post()
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    @ApiParam({ name: "school" })
    async createSubject(
        @Body()
        body: CreateSubjectDTO,
        @CurrentUser() user: VerifiedSchoolUser,
    ) {
        try {
            const subject = await this.subjectService.create({
                ...body,
                school: user.school,
            });
            Object.assign(subject.school, null);
            return subject;
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }
}
