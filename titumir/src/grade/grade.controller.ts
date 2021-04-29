import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  Post,
} from "@nestjs/common";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import AssignSubjectsDTO from "./dto/assign-subject.dto";
import CreateGradeDTO from "./dto/create-grade.dto";
import { GradeSubjectService } from "./grade-subject.service";
import { GradeService } from "./grade.service";

@Controller("/school/:school/grade")
export class GradeController {
  logger: Logger = new Logger(GradeController.name);
  constructor(
    private readonly gradeService: GradeService,
    private readonly gradeToSubjectService: GradeSubjectService
  ) {}

  @Get()
  @VerifySchool()
  async getAllGradeOfSchool(@CurrentUser() user: User) {
    try {
      const grades = await this.gradeService.findAll({ school: user.school });
      return grades;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Get(":grade")
  @VerifySchool()
  async getMonoGrade(
    @CurrentUser("school") school: School,
    @Param("grade") standard: number
  ) {
    try {
      const grade = await this.gradeService.findOne(
        { school, standard },
        {
          relations: [
            "grades_subjects",
            "grades_subjects.subject",
            "moderator",
            "examiner",
          ],
        }
      );
      return {
        ...grade,
        grades_subjects: undefined,
        subjects: grade.grades_subjects.map((gs) => gs.subject),
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

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
  @VerifyGrade()
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin, USER_ROLE.gradeModerator)
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

  @Post(":grade/assign-moderator")
  @VerifySchool()
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
  async assignModerator() {
    try {
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
