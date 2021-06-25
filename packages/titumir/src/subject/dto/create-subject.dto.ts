import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";

export default class CreateSubjectDTO {
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(50)
    name!: string;

    @IsDefined()
    @IsNotEmpty()
    description!: string;
}
