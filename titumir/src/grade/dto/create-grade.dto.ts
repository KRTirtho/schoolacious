import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber, IsPositive } from "class-validator";

export default class CreateGradeDTO {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ type: Number, description: "grade's standard number", example: 2 })
    standard!: number;
}
