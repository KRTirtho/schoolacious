import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";
import LoginDTO from "./login.dto";

export default class SignupDTO extends LoginDTO {
  @IsNotEmpty()
  @IsDefined()
  @MaxLength(50)
  first_name!: string;

  @IsNotEmpty()
  @IsDefined()
  @MaxLength(50)
  last_name!: string;
}
