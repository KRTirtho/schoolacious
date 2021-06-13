import { Controller, Get, Logger } from "@nestjs/common";
import { INVITATION_OR_JOIN_TYPE } from "../database/entity/invitations_or_joins.entity";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { InvitationJoinService } from "../invitation-join/invitation-join.service";

@Controller("user")
export class UserController {
    logger: Logger = new Logger(UserController.name);
    constructor(private readonly invitationJoinService: InvitationJoinService) {}
    @Get("invitations")
    async getInvitations(@CurrentUser() user: User) {
        try {
            return this.invitationJoinService.getUserInvitationsJoin({
                _id: user._id,
                type: INVITATION_OR_JOIN_TYPE.invitation,
            });
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }
    @Get("join-requests")
    async getJoinRequests(@CurrentUser() user: User) {
        try {
            return this.invitationJoinService.getUserInvitationsJoin({
                _id: user._id,
                type: INVITATION_OR_JOIN_TYPE.join,
            });
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }
}
