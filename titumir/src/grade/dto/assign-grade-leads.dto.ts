import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

export default class AssignGradeLeadsDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ type: String })
    user_id!: string;
}
