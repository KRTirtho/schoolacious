import { MaxLength, IsEmail, IsNotEmpty, MinLength } from "class-validator";

export default class LoginDTO {
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
