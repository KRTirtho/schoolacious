import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

export default class TeacherStudentDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  _id!: string;
}
