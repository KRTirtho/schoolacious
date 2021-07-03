import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsEnum, IsOptional, IsUUID } from "class-validator";
import {
    INVITATION_OR_JOIN_ROLE,
    INVITATION_OR_JOIN_TYPE,
} from "../../database/entity/invitations_or_joins.entity";

export class InvitationDTO {
    @IsDefined()
    @IsUUID()
    @ApiProperty({
        type: String,
    })
    user_id!: string;

    @IsDefined()
    @IsEnum(INVITATION_OR_JOIN_ROLE)
    @ApiProperty({ enum: INVITATION_OR_JOIN_ROLE })
    role!: INVITATION_OR_JOIN_ROLE;
}
export class JoinDTO {
    @IsDefined()
    @IsUUID()
    @ApiProperty({
        type: String,
    })
    school_id!: string;

    @IsDefined()
    @IsEnum(INVITATION_OR_JOIN_ROLE)
    @ApiProperty({ enum: INVITATION_OR_JOIN_ROLE })
    role!: INVITATION_OR_JOIN_ROLE;
}

export default class InvitationJoinDTO {
    @IsOptional()
    @IsUUID()
    @ApiPropertyOptional({
        type: String,
        description:
            "user's uuid to whom the invitation will be sent. Should not be used with `INVITATION_OR_JOIN_TYPE.join`",
    })
    user_id?: string;

    @IsOptional()
    @IsUUID()
    @ApiProperty({
        type: String,
        description:
            "school's uuid to which the join request will be sent. Should not be used with `INVITATION_OR_JOIN_TYPE.invitation`",
    })
    school_id?: string;

    @IsDefined()
    @IsEnum(INVITATION_OR_JOIN_ROLE)
    @ApiProperty({ enum: INVITATION_OR_JOIN_ROLE })
    role!: INVITATION_OR_JOIN_ROLE;

    @IsDefined()
    @IsEnum(INVITATION_OR_JOIN_TYPE)
    @ApiProperty({ enum: INVITATION_OR_JOIN_TYPE })
    type!: INVITATION_OR_JOIN_TYPE;
}
