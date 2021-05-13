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
  name!: string;

  @IsDefined()
  @IsEmail()
  email!: string;

  @IsDefined()
  @IsMobilePhone("any" as validator.MobilePhoneLocale)
  phone!: string;

  @IsDefined()
  @IsNotEmpty()
  description!: string;

  @IsDefined()
  @IsLowercase()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/\w*\d*-*/g)
  short_name!: string;
}
