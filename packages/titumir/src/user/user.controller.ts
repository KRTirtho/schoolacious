import { Controller, Get, Inject, Logger } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { INVITATION_OR_JOIN_TYPE } from "../database/entity/invitations_or_joins.entity";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { InvitationJoinService } from "../invitation-join/invitation-join.service";

@Controller("user")
@ApiBearerAuth()
export class UserController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
        private readonly invitationJoinService: InvitationJoinService,
    ) {
        this.logger.setContext(UserController.name);
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
