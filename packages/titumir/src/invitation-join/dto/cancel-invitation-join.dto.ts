import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsUUID } from "class-validator";

export default class CancelInvitationJoinDTO {
    @IsDefined()
    @IsUUID()
    @ApiProperty({
        type: String,
        description: "unique identifier of the invitation/join",
    })
    _id!: string;
}
