import { IsDefined, IsUUID } from "class-validator";

export default class CancelInvitationJoinDTO {
  @IsDefined()
  @IsUUID()
  _id!: string;
}
