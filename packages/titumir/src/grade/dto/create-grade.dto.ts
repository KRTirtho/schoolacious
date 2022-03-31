import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNumber, IsOptional, IsPositive } from "class-validator";

export default class CreateGradeDTO {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ type: Number, description: "grade's standard number", example: 2 })
    standard!: number;

    @IsOptional()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: "email of user, whom to be grade's moderator",
    })
    moderator?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: "email of user, whom to be grade's examiner",
    })
    examiner?: string;
}
