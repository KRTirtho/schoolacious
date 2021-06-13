import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsUUID,
    Max,
} from "class-validator";

export default class AssignSubjectsDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    subject_id!: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Max(100)
    mark?: number;
}
