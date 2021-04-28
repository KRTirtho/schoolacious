import {
  Body,
  Controller,
  Logger,
  Param,
  ParseArrayPipe,
  Post,
} from "@nestjs/common";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import AssignSubjectsDTO from "./dto/assign-subject.dto";
import CreateGradeDTO from "./dto/create-grade.dto";
import { GradeSubjectService } from "./grade-section.service";
import { GradeService } from "./grade.service";

@Controller("/school/:school/grade")
export class GradeController {
  logger: Logger = new Logger(GradeController.name);
  constructor(
    private readonly gradeService: GradeService,
    private readonly gradeToSubjectService: GradeSubjectService
  ) {}

  @Post()
  @VerifySchool()
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
  async createGrade(
    @Body(new ParseArrayPipe({ items: CreateGradeDTO })) body: CreateGradeDTO[],
    @CurrentUser() user: User
  ) {
    try {
      const grade = await this.gradeService.create(
        body.map((grade) => ({ ...grade, school: user.school }))
      );
      return grade;
    } catch (error) {
      this.logger.error({ ...error });
      throw error;
    }
  }

  @Post(":grade/subject")
  @VerifySchool()
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
  async assignSubjects(
    @Body(new ParseArrayPipe({ items: AssignSubjectsDTO }))
    body: AssignSubjectsDTO[],
    @Param("grade") standard: number,
    @CurrentUser() user: User
  ) {
    try {
      const grade = await this.gradeService.findOne({
        school: user.school,
        standard,
      });
      const gradesToSubjects = await this.gradeToSubjectService.create(
        body.map(({ subject_id, mark }) => ({
          subject: { _id: subject_id },
          grade,
          mark,
        }))
      );
      return gradesToSubjects;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
