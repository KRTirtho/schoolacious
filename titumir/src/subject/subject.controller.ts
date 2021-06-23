import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    ParseArrayPipe,
    Post,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import CreateSubjectDTO from "./dto/create-subject.dto";
import defaultSubjects from "./static/default-subjects";
import { SubjectService } from "./subject.service";

@Controller("/school/:school/subject")
@ApiBearerAuth()
export class SubjectController {
    logger: Logger = new Logger(SubjectController.name);

    constructor(private readonly subjectService: SubjectService) {}

    @Get("defaults")
    @VerifySchool()
    getDefaultSubjects(@Param("school") _?: number) {
        return defaultSubjects;
    }

    @Get()
    @VerifySchool()
    async getAlSubject(@CurrentUser() user: User, @Param("school") _?: number) {
        try {
            return await this.subjectService.find({ school: user.school! });
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }

    @Post()
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    async createSubjects(
        @Body(new ParseArrayPipe({ items: CreateSubjectDTO }))
        body: CreateSubjectDTO[],
        @CurrentUser() user: User,
        @Param("school") _?: number,
    ) {
        try {
            const subjects = await this.subjectService.create(
                body.map((subject) => ({ ...subject, school: user.school! })),
            );
            return subjects.map((subject) => ({ ...subject, school: undefined }));
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }
}
