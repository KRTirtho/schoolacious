import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import CreateSchoolDTO from "../school/dto/create-school.dto";
import defaultSubjects from "./static/default-subjects";
import { SubjectService } from "./subject.service";

@Controller("/school/:school/subject")
export class SubjectController {
  logger: Logger = new Logger(SubjectController.name);

  constructor(private readonly subjectService: SubjectService) {}

  @Get("defaults")
  @VerifySchool()
  getDefaultSubjects() {
    return defaultSubjects;
  }

  @Get()
  @VerifySchool()
  async getAlSubject(@CurrentUser() user: User) {
    try {
      return await this.subjectService.find({ school: user.school });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Post()
  @VerifySchool()
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
  async createSubjects(
    @Body() body: CreateSchoolDTO[],
    @CurrentUser() user: User
  ) {
    try {
      const subjects = await this.subjectService.create(
        body.map((subject) => ({ ...subject, school: user.school }))
      );
      return subjects.map((subject) => ({ ...subject, school: undefined }));
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
