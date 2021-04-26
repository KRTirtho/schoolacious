import { Body, Controller, Logger, Post } from "@nestjs/common";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import CreateGradeDTO from "./dto/create-grade.dto";
import { GradeService } from "./grade.service";

@Controller("/school/:school/grade")
export class GradeController {
  logger: Logger = new Logger(GradeController.name);
  constructor(private readonly gradeService: GradeService) {}

  @Post()
  @VerifySchool()
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
  async createGrade(@Body() body: CreateGradeDTO, @CurrentUser() user: User) {
    try {
      const grade = await this.gradeService.create({
        ...body,
        school: user.school,
      });
      return grade;
    } catch (error) {
      this.logger.error({ ...error });
      throw error;
    }
  }
}
