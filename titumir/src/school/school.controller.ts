import {
  Body,
  Controller,
  Logger,
  Post,
  NotAcceptableException,
  Get,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { createQueryBuilder, DeepPartial } from "typeorm";
import { INVITATION_OR_JOIN_TYPE } from "../database/entity/invitations_or_joins.entity";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { InvitationJoinService } from "../invitation-join/invitation-join.service";
import { UserService } from "../user/user.service";
import AddCoAdminDTO from "./dto/add-co-admin.dto";
import CreateSchoolDTO from "./dto/create-school.dto";
import { SchoolService } from "./school.service";

@Controller("school")
export class SchoolController {
  logger: Logger = new Logger(SchoolController.name);
  constructor(
    private readonly schoolService: SchoolService,
    private readonly userService: UserService,
    private readonly invitationJoinService: InvitationJoinService
  ) {}

  @Get(":school")
  async getSchool(@Param("school") short_name: string) {
    try {
      const school = await createQueryBuilder(School, "school")
        .where("school.short_name=:short_name", { short_name })
        .leftJoinAndSelect("school.admin", "admin")
        .getOne();
      if (!school) throw new NotFoundException("school doesn't exist");
      return school;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Get(":school/join-requests")
  @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
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

  @Post("co-admin")
  async addCoAdmin(@Body() body: AddCoAdminDTO) {
    try {
      const newCoAdmin = await this.userService.findUser(
        { _id: body._id },
        { select: ["role"] }
      );

      if (newCoAdmin.role === USER_ROLE.coAdmin) {
        throw new NotAcceptableException(
          "User already is a co-admin. Cannot assign twice"
        );
      }
      const payload: DeepPartial<School> = {};
      payload[body.index === 1 ? "coAdmin1" : "coAdmin2"] = { _id: body._id };
      this.schoolService.update({ _id: body.school_id }, payload);
    } catch (error) {
      this.logger.log(error.message);
      throw error;
    }
  }
}
