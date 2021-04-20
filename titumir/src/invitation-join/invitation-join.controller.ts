import { Body, Controller, Delete, Logger, Post } from "@nestjs/common";
import { INVITATION_OR_JOIN_TYPE } from "../database/entity/invitations_or_joins.entity";
import CancelInvitationJoinDTO from "./dto/cancel-invitation-join.dto";
import CompleteInvitationJoinDTO from "./dto/complete-invitation-join.dto";
import InvitationJoinDTO from "./dto/invitation-join.dto";
import { InvitationJoinService } from "./invitation-join.service";

@Controller("invitation-join")
export class InvitationJoinController {
  logger: Logger = new Logger(InvitationJoinController.name);
  constructor(private readonly invitationJoinService: InvitationJoinService) {}

  @Post()
  async inviteJoinUser(@Body() { type, ...body }: InvitationJoinDTO) {
    try {
      if (type === INVITATION_OR_JOIN_TYPE.invitation) {
        return await this.invitationJoinService.invite(body);
      }
      return await this.invitationJoinService.join(body);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Post("complete")
  async completeInvitationJoin(@Body() body: CompleteInvitationJoinDTO) {
    try {
      return await this.invitationJoinService.complete(body);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Delete()
  async cancelInvitationJoin(@Body() body: CancelInvitationJoinDTO) {
    try {
      return this.invitationJoinService.cancel(body);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
