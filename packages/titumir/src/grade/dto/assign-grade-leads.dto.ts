import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export default class AssignGradeLeadsDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ type: String })
    email!: string;
}
