import { IsEnum } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import Grade from "./grades.entity";
import Section from "./sections.entity";
import User from "./users.entity";

export enum SECTION_ROLE {
  teacher = "teacher",
  student = "student",
}

@Entity()
// this allows to run the unique index only when user is a student
// and doesn't affect when role = teacher. Thus student can't be at
// multiple grades -> sections & only allows the teacher to be in
// multiple grades -> sections at same time
@Index(["user", "role"], { unique: true, where: "role = 'student'" })
// prevents any duplicate entry with same grade, section & user
@Unique(["grade", "section", "user"])
export default class UsersToSectionsToGrades {
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @ManyToOne(() => Grade, (grade) => grade.usersToSectionsToGrade)
  grade!: Grade;

  @ManyToOne(() => User, (user) => user.userToSectionsToGrades)
  user!: User;

  @ManyToOne(() => Section, (section) => section.usersToSectionToGrades)
  section!: Section;

  @Column()
  @CreateDateColumn()
  assigned_at!: Date;

  @IsEnum(SECTION_ROLE)
  @Column("varchar", { length: 10 })
  role!: SECTION_ROLE;
}
