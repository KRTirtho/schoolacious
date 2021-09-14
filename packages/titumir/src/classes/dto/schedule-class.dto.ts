import { ApiProperty } from "@nestjs/swagger";
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsUUID,
    Max,
    Min,
    Matches,
} from "class-validator";

const hhmmssRegex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/g;
export default class ScheduleClassDto {
    @IsDefined()
    @IsNumber()
    @Min(0)
    @Max(6)
    @ApiProperty({
        type: Number,
        minimum: 0,
        maximum: 6,
        description: "day of the week",
        example: 2,
    })
    day!: number;

    @IsDefined()
    @IsNotEmpty()
    @Matches(hhmmssRegex, {
        message: "time should contain following format HH:mm:ss",
    })
    @ApiProperty({
        type: String,
        description: "class start time in HH:MM:SS format in 24hrs",
        pattern: String(hhmmssRegex),
        example: "17:30:00",
    })
    time!: string;

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
