import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { INVITATION_OR_JOIN_TYPE } from "../../database/entity/invitations_or_joins.entity";

export default class CancelInvitationJoinDTO {
  @IsUUID()
  _id: string;

  @IsEnum(INVITATION_OR_JOIN_TYPE)
  type: INVITATION_OR_JOIN_TYPE;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  school_id?: string;
}
