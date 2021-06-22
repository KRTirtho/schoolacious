import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsPositive, IsUUID } from "class-validator";

export default class AddCoAdminDTO {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ enum: [1, 2] })
    index!: 1 | 2;

    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ type: String, description: "the who'll be co-admin" })
    user_id!: string;
}
