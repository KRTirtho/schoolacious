import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

export default class AssignClassTeacherDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        type: String,
        description: "user id of whom, who will be added as a teacher",
    })
    user_id!: string;
}
