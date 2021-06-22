import { MaxLength, IsEmail, IsNotEmpty, MinLength, IsDefined } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export default class LoginDTO {
    @MaxLength(100)
    @IsDefined()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: "user email",
        maxLength: 100,
        example: "123-man_woman@test.com",
    })
    email!: string;

    @IsNotEmpty()
    @IsDefined()
    @MinLength(8)
    @ApiProperty({ type: String, description: "user password", example: "12345678" })
    password!: string;
}
