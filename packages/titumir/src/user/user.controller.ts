import { Controller, Get, Logger, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { INVITATION_OR_JOIN_TYPE } from "@veschool/types";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { InvitationJoinService } from "../invitation-join/invitation-join.service";
import { UserService } from "./user.service";
import { Throttle } from "@nestjs/throttler";
import { NotificationService } from "../notification/notification.service";

@Controller("user")
@ApiBearerAuth()
export class UserController {
    logger = new Logger(UserController.name);
    constructor(
        private readonly invitationJoinService: InvitationJoinService,
        private readonly userService: UserService,
        private readonly notificationService: NotificationService,
    ) {}

    @Get("me")
    @ApiUnauthorizedResponse()
    echoMe(@CurrentUser() user: User) {
        try {
            return user;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get("query")
    @Throttle(60, 60)
    @ApiUnauthorizedResponse()
    @ApiQuery({ name: "school_id", required: false })
    @ApiQuery({ name: "role", required: false })
    async queryUser(
        @Query("q") query: string,
        @Query("school_id") school_id?: string,
        @Query("role") role?: string,
    ) {
        try {
            const users = await this.userService
                .queryBuilder("user")
                .select()
                .where("user.query_common @@ to_tsquery(:query)", { query: `${query}:*` })
                .andWhere(
                    school_id ? "user.school = :school_id" : "user.school IS NULL",
                    school_id ? { school_id: school_id } : undefined,
                )
                .andWhere(
                    role ? "user.role = :role" : "user.role IS NULL",
                    role
                        ? {
                              role: role,
                          }
                        : undefined,
                )
                .getMany();
            return users;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get("invitations")
    @ApiUnauthorizedResponse()
    async getInvitations(@CurrentUser() user: User) {
        try {
            return this.invitationJoinService.getUserInvitationsJoin({
                _id: user._id,
                type: INVITATION_OR_JOIN_TYPE.invitation,
            });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }
    @Get("join-requests")
    @ApiUnauthorizedResponse()
    async getJoinRequests(@CurrentUser() user: User) {
        try {
            return this.invitationJoinService.getUserInvitationsJoin({
                _id: user._id,
                type: INVITATION_OR_JOIN_TYPE.join,
            });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get("notifications")
    async getNotifications(@CurrentUser() user: User) {
        return await this.notificationService.find({}, { where: { user } });
    }
}
