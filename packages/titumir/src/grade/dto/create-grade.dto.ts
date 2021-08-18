import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";

export default class CreateGradeDTO {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ type: Number, description: "grade's standard number", example: 2 })
    standard!: number;

    @IsOptional()
    @IsUUID()
    @ApiProperty({
        type: String,
        description: "id of user, whom to be grade's moderator",
    })
    moderator?: string;

    @IsOptional()
    @IsUUID()
    @ApiProperty({
        type: String,
        description: "id of user, whom to be grade's examiner",
    })
    examiner?: string;
}
