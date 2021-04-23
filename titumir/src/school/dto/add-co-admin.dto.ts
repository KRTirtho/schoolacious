import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from "class-validator";

export default class AddCoAdminDTO {
  @IsDefined()
  @IsNumber()
  @IsPositive()
  index: 1 | 2;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
}
