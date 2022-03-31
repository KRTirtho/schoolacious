import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEnum, IsUUID } from "class-validator";
import { INVITATION_OR_JOIN_ACTION } from "../invitation-join.service";

export default class CompleteInvitationJoinDTO {
    @IsDefined()
    @IsUUID()
    @ApiProperty({
        type: String,
        description: "uuid of the corresponding invitation/join",
    })
    _id!: string;

    @IsDefined()
    @IsEnum(INVITATION_OR_JOIN_ACTION)
    @ApiProperty({ enum: INVITATION_OR_JOIN_ACTION })
    action!: INVITATION_OR_JOIN_ACTION;
}
