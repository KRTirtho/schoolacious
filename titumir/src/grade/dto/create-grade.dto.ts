import { IsDefined, IsNumber, IsPositive } from "class-validator";

export default class CreateGradeDTO {
  @IsDefined()
  @IsNumber()
  @IsPositive()
  standard: number;
}
