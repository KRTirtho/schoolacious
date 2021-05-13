import { IsDefined, IsEnum, IsOptional, IsUUID } from "class-validator";
import {
  INVITATION_OR_JOIN_ROLE,
  INVITATION_OR_JOIN_TYPE,
} from "../../database/entity/invitations_or_joins.entity";

export default class InvitationJoinDTO {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  school_id?: string;

  @IsDefined()
  @IsEnum(INVITATION_OR_JOIN_ROLE)
  role!: INVITATION_OR_JOIN_ROLE;

  @IsDefined()
  @IsEnum(INVITATION_OR_JOIN_TYPE)
  type!: INVITATION_OR_JOIN_TYPE;
}
