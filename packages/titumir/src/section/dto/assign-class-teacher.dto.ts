import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export default class AssignClassTeacherDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: "email of whom, who will be added as a teacher",
    })
    email!: string;
}
