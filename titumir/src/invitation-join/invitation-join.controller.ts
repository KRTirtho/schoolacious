import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Logger,
    Post,
} from "@nestjs/common";
import { INVITATION_OR_JOIN_TYPE } from "../database/entity/invitations_or_joins.entity";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { isAdministrative } from "../utils/helper-functions.util";
import CancelInvitationJoinDTO from "./dto/cancel-invitation-join.dto";
import CompleteInvitationJoinDTO from "./dto/complete-invitation-join.dto";
import InvitationJoinDTO from "./dto/invitation-join.dto";
import { InvitationJoinService } from "./invitation-join.service";

@Controller("invitation-join")
export class InvitationJoinController {
    logger: Logger = new Logger(InvitationJoinController.name);
    constructor(private readonly invitationJoinService: InvitationJoinService) {}

    @Post()
    async inviteJoinUser(
        @Body() { type, ...body }: InvitationJoinDTO,
        @CurrentUser() user: User,
    ) {
        try {
            if (
                type === INVITATION_OR_JOIN_TYPE.invitation &&
                body.user_id &&
                isAdministrative(user.role)
            ) {
                delete body.school_id;
                return await this.invitationJoinService.invite({
                    ...body,
                    user_id: body.user_id,
                    school: user.school!,
                });
            } else if (type === INVITATION_OR_JOIN_TYPE.join && body.school_id) {
                delete body.user_id;
                return await this.invitationJoinService.join({
                    ...body,
                    school_id: body.school_id,
                    user,
                });
            } else {
                throw new ForbiddenException("wrong credentials");
            }
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }

    @Post("complete")
    async completeInvitationJoin(
        @CurrentUser() user: User,
        @Body() body: CompleteInvitationJoinDTO,
    ) {
        try {
            return await this.invitationJoinService.complete({ ...body, user });
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }

    @Delete()
    async cancelInvitationJoin(
        @Body() body: CancelInvitationJoinDTO,
        @CurrentUser() user: User,
    ) {
        try {
            return this.invitationJoinService.cancel({ ...body, user });
        } catch (error: any) {
            this.logger.error(error.message);
            throw error;
        }
    }
}
