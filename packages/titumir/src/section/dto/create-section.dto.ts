import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";

export default class CreateSectionDTO {
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({ type: String, maxLength: 100, minLength: 1, example: "A" })
    name!: string;
}
