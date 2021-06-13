import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

export default class AssignGradeLeadsDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    user_id!: string;
}
