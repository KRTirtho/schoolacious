import { Body, Controller, Logger, Post, Get, Param } from "@nestjs/common";
import { createQueryBuilder } from "typeorm";
import { INVITATION_OR_JOIN_TYPE } from "../database/entity/invitations_or_joins.entity";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import { InvitationJoinService } from "../invitation-join/invitation-join.service";
import AddCoAdminDTO from "./dto/add-co-admin.dto";
import CreateSchoolDTO from "./dto/create-school.dto";
import { SchoolService } from "./school.service";

@Controller("school")
export class SchoolController {
  logger: Logger = new Logger(SchoolController.name);
  constructor(
    private readonly schoolService: SchoolService,
    private readonly invitationJoinService: InvitationJoinService
  ) {}

  @Get(":school")
  async getSchool(@Param("school") short_name: string) {
    try {
      const school = await createQueryBuilder(School, "school")
        .where("school.short_name=:short_name", { short_name })
        .leftJoinAndSelect("school.admin", "admin")
        .getOneOrFail();
      return school;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Get(":school/join-requests")
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
  @VerifySchool()
  async getSchoolJoinRequests(@CurrentUser() user: User) {
    try {
      return this.invitationJoinService.getSchoolInvitationJoin({
        _id: user.school._id,
        type: INVITATION_OR_JOIN_TYPE.join,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Get(":school/invitations")
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
  @VerifySchool()
  async getSchoolSentInvitations(@CurrentUser() user: User) {
    try {
      return this.invitationJoinService.getSchoolInvitationJoin({
        _id: user.school._id,
        type: INVITATION_OR_JOIN_TYPE.invitation,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Post()
  async createSchool(@CurrentUser() user: User, @Body() body: CreateSchoolDTO) {
    try {
      const school = await this.schoolService.create({ admin: user, ...body });
      return school;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Post(":school/co-admin")
  @Roles(USER_ROLE.admin)
  @VerifySchool()
  async addCoAdmin(@Body() body: AddCoAdminDTO, @CurrentUser() user: User) {
    try {
      return this.schoolService.assignCoAdmin({ ...body, user });
    } catch (error) {
      this.logger.log(error.message);
      throw error;
    }
  }
}
