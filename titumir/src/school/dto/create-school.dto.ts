import {
  IsDefined,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  Matches,
  MaxLength,
} from "class-validator";

export default class CreateSchoolDTO {
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNumber()
  phone: number;

  @IsDefined()
  @IsNotEmpty()
  description: string;

  @IsDefined()
  @IsLowercase()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/\w*\d*-*/g)
  short_name: string;
}
