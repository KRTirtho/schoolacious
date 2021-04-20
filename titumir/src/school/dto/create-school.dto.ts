import { IsEmail, IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export default class CreateSchoolDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  phone: number;

  @IsNotEmpty()
  description: string;
}
