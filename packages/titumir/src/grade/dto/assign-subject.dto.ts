import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
    @ApiProperty({ type: String })
    subject_id!: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Max(100)
    @ApiPropertyOptional({
        type: Number,
        description: "mark of that subject",
        example: 100,
    })
    mark?: number;
}
