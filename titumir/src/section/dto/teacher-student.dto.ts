import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

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

export class TeacherDTO extends StudentDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ type: String, description: "teacher's subject" })
    subject_id!: string;
}
