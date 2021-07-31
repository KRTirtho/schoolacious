import { Controller, Get, Inject, Logger, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
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
    async queryUser(@Query("q") query: string) {
        try {
            const users = await this.userService
                .queryBuilder("user")
                .select()
                .where("user.query_common @@ to_tsquery(:query)", { query: `${query}:*` })
                .andWhere("user.school IS NULL")
                .andWhere("user.role IS NULL")
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
