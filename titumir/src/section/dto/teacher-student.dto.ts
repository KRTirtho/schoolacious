import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

export default class StudentDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  _id!: string;
}

export class TeacherDTO extends StudentDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  subject_id!: string;
}
