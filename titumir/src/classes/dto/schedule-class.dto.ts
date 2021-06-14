import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsUUID,
    Max,
    Min,
    Matches,
} from "class-validator";

export default class ScheduleClassDto {
    @IsDefined()
    @IsNumber()
    @Min(0)
    @Max(6)
    day!: number;

    @IsDefined()
    @IsNotEmpty()
    @Matches(/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/g, {
        message: "time should contain following format HH:mm:ss",
    })
    time!: string;

    @IsDefined()
    @IsUUID()
    host!: string;

    @IsDefined()
    @IsNumber()
    @Min(600) //10min
    @Max(3600) // 1hrs | for not more than one hour bound
    duration!: number; // in seconds

    @IsDefined()
    @IsNotEmpty()
    section_name!: string;
}
