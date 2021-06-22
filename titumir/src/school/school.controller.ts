import { Body, Controller, Logger, Post, Get, Param, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse } from "@nestjs/swagger";
import { INVITATION_OR_JOIN_TYPE } from "../database/entity/invitations_or_joins.entity";
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
        private readonly invitationJoinService: InvitationJoinService,
    ) {}

    @Get(":school")
    @ApiNotFoundResponse({ description: "passed {school} doesn't exist" })
    async getSchool(@Param("school") short_name: string) {
        try {
            const school = await this.schoolService
                .queryBuilder("school")
                .where("school.short_name=:short_name", { short_name })
                .leftJoinAndSelect("school.admin", "admin")
                .leftJoinAndSelect("school.coAdmin1", "coAdmin1")
                .leftJoinAndSelect("school.coAdmin2", "coAdmin2")
                .getOneOrFail();
            return school;
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }

    @Get(":school/join-requests")
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    @ApiBearerAuth()
    async getSchoolJoinRequests(@CurrentUser() user: User) {
        try {
            return this.invitationJoinService.getSchoolInvitationJoin({
                _id: user.school!._id,
                type: INVITATION_OR_JOIN_TYPE.join,
            });
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }

    @Get(":school/invitations")
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    @ApiBearerAuth()
    async getSchoolSentInvitations(@CurrentUser() user: User) {
        try {
            return this.invitationJoinService.getSchoolInvitationJoin({
                _id: user.school!._id,
                type: INVITATION_OR_JOIN_TYPE.invitation,
            });
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }

    @Post()
    @ApiBearerAuth()
    async createSchool(@CurrentUser() user: User, @Body() body: CreateSchoolDTO) {
        try {
            const school = await this.schoolService.createSchool({
                admin: user,
                ...body,
            });
            return school;
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }

    @Put(":school/co-admin")
    @VerifySchool()
    @Roles(USER_ROLE.admin)
    @ApiBearerAuth()
    async addCoAdmin(@Body() body: AddCoAdminDTO, @CurrentUser() user: User) {
        try {
            return this.schoolService.assignCoAdmin({ ...body, user });
        } catch (error: any) {
            this.logger.log(error.message);
            throw error;
        }
    }
}
