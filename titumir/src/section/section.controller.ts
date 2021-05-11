import { Body, Controller, Logger, ParseArrayPipe, Post } from "@nestjs/common";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifyGrade } from "../decorator/verify-grade.decorator";
import CreateSectionDTO from "./dto/create-section.dto";
import { SectionService } from "./section.service";

@Controller("/school/:school/grade/:grade/section")
export class SectionController {
  logger: Logger = new Logger(SectionController.name);
  constructor(private sectionService: SectionService) {}

  @Post()
  @VerifyGrade()
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin, USER_ROLE.gradeModerator)
  async createSection(
    @Body(new ParseArrayPipe({ items: CreateSectionDTO }))
    body: CreateSectionDTO[],
    @CurrentUser() user: User
  ) {
    try {
      return (
        await this.sectionService.createSection(
          body.map(({ name }) => ({ name, grade: user.school.grades[0] }))
        )
      ).map((section) => ({ ...section, grade: undefined }));
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
