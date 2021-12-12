import { MinLength, IsUUID, IsEnum } from "class-validator";
import { NOTIFICATION_STATUS } from "@veschool/types";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNotificationByIdDto {
    @MinLength(1)
    @IsUUID(undefined, { each: true })
    @ApiProperty({ type: [String] })
    notifications!: string[];

    @IsEnum(NOTIFICATION_STATUS)
    @ApiProperty({ enum: NOTIFICATION_STATUS })
    status!: NOTIFICATION_STATUS;
}
