import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, IsUUID } from "class-validator";

export default class StudentDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        type: String,
        description: "user id of whom will be added",
    })
    _id!: string;
}

export class TeacherDTO {
    @IsDefined()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: "user id of whom will be added",
    })
    email!: string;

    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ type: String, description: "teacher's subject" })
    subject_id!: string;
}
