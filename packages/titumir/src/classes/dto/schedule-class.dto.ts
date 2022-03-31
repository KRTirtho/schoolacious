import { ApiProperty } from "@nestjs/swagger";
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsUUID,
    Max,
    Min,
    IsDateString,
} from "class-validator";

export default class ScheduleClassDto {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({
        type: Date,
        description: "local date of the class defining the week-day & time",
        example: "Tue Nov 30 2021 22:25:00 GMT+0600 (Bangladesh Standard Time)",
    })
    date!: string;

    @IsDefined()
    @IsUUID()
    @ApiProperty({ type: String, description: "user _id of applicable teacher" })
    host!: string;

    @IsDefined()
    @IsNumber()
    @Min(600) //10min
    @Max(3600) // 1hrs | for not more than one hour bound
    @ApiProperty({
        type: Number,
        description: "duration of the class in seconds",
        minimum: 600,
        maximum: 3600,
        example: 2400,
    })
    duration!: number; // in seconds
}
