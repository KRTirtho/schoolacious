import { Type } from "class-transformer";
import {
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsDefined,
    IsNumber,
    IsUUID,
    Max,
    ValidateNested,
} from "class-validator";

class ClassDto {
    @IsDefined()
    @IsDateString()
    schedule!: Date;
    @IsDefined()
    @IsUUID()
    host!: string;

    @IsDefined()
    @IsNumber()
    @Max(3600) // for not more than one hour bound
    duration!: number; // in seconds
}

export default class ScheduleClassDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ClassDto)
    @ArrayMinSize(1)
    weekly!: ClassDto[];
}
