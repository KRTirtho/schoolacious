import { IsEnum, IsUUID } from "class-validator";
import {
  INVITATION_OR_JOIN_ROLE,
  INVITATION_OR_JOIN_TYPE,
} from "../../database/entity/invitations_or_joins.entity";

export default class InvitationJoinDTO {
  @IsUUID()
  user_id: string;

  @IsUUID()
  school_id: string;

  @IsEnum(INVITATION_OR_JOIN_ROLE)
  role: INVITATION_OR_JOIN_ROLE;

  @IsEnum(INVITATION_OR_JOIN_TYPE)
  type: INVITATION_OR_JOIN_TYPE;
}
