import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from "class-validator";

export default class AddCoAdminDTO {
  @IsNumber()
  @IsPositive()
  index: 1 | 2;

  @IsNotEmpty()
  @IsUUID()
  user_id: string;
}
