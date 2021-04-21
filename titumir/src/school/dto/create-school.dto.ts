import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  Matches,
  MaxLength,
} from "class-validator";

export default class CreateSchoolDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  phone: number;

  @IsNotEmpty()
  description: string;

  @IsLowercase()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/\w*\d*-*/g)
  short_name: string;
}
