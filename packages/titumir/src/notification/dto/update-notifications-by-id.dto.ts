import { IsUUID, IsEnum, ArrayNotEmpty } from "class-validator";
import { NOTIFICATION_STATUS } from "@schoolacious/types";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNotificationByIdDto {
    @ArrayNotEmpty()
    @IsUUID(undefined, { each: true })
    @ApiProperty({ type: [String] })
    notifications!: string[];

    @IsEnum(NOTIFICATION_STATUS)
    @ApiProperty({ enum: NOTIFICATION_STATUS })
    status!: NOTIFICATION_STATUS;
}
