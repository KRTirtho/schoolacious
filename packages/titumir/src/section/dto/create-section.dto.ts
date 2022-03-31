import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export default class CreateSectionDTO {
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({ type: String, maxLength: 100, minLength: 1, example: "A" })
    name!: string;

    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: "email of whom, who will be added as a teacher",
    })
    class_teacher!: string;
}
