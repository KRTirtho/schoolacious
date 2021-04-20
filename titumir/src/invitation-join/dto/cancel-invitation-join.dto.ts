import { IsUUID } from "class-validator";

export default class CancelInvitationJoinDTO {
  @IsUUID()
  _id: string;
}
