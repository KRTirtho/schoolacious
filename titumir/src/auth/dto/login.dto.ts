import { MaxLength, IsEmail, IsNotEmpty, MinLength, IsDefined } from "class-validator";

export default class LoginDTO {
    @MaxLength(100)
    @IsDefined()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsDefined()
    @MinLength(8)
    password!: string;
}
