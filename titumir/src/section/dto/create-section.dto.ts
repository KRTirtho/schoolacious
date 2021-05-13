import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";

export default class CreateSectionDTO {
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}
