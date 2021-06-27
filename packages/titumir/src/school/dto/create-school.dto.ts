import { ApiProperty } from "@nestjs/swagger";
import {
    IsDefined,
    IsEmail,
    IsLowercase,
    IsMobilePhone,
    IsNotEmpty,
    Matches,
    MaxLength,
} from "class-validator";
import validator from "validator";

export default class CreateSchoolDTO {
    @IsDefined()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: "The non-unique fancy display name of school",
        example: "Saint Gregory School or Hell",
    })
    name!: string;

    @IsDefined()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: "unique & non-personal/organization email",
        example: "oak@thu.com",
    })
    email!: string;

    @IsDefined()
    @IsMobilePhone("any" as validator.MobilePhoneLocale)
    @ApiProperty({
        type: String,
        description: "International phone number",
        example: "8801711111111",
    })
    phone!: string;

    @IsDefined()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: "short description about the school",
        example: "School/Hell",
    })
    description!: string;

    @IsDefined()
    @IsLowercase()
    @IsNotEmpty()
    @MaxLength(20)
    @Matches(/^[a-z\d-]+$/)
    @ApiProperty({
        type: String,
        description: "unique human readable identifier",
        example: "st-gregory",
        pattern: String(/^[a-z\d-]+$/),
        maxLength: 20,
    })
    short_name!: string;
}
