import { Controller, Get, Inject, Logger, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { INVITATION_OR_JOIN_TYPE } from "@veschool/types";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { InvitationJoinService } from "../invitation-join/invitation-join.service";
import { UserService } from "./user.service";
import { Throttle } from "@nestjs/throttler";

@Controller("user")
@ApiBearerAuth()
export class UserController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
        private readonly invitationJoinService: InvitationJoinService,
        private readonly userService: UserService,
    ) {
        this.logger.setContext(UserController.name);
    }

    @Get("me")
    @ApiUnauthorizedResponse()
    echoMe(@CurrentUser() user: User) {
        try {
            return user;
        } catch (error) {
            this.logger.error(error?.message ?? "");
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
            this.logger.error(error?.message ?? "");
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
            this.logger.error(error?.message ?? "");
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
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }
}
