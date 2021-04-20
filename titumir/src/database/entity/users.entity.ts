import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Class from "./classes.entity";
import Invitations_Joins from "./invitations_or_joins.entity";
import School from "./schools.entity";
import UsersToSections from "./user_section.entity";

export enum USER_ROLE {
  admin = "admin",
  coAdmin = "co-admin",
  gradeModerator = "grade-moderator",
  gradeExaminer = "grade-examiner",
  classTeacher = "class-teacher",
  teacher = "teacher",
  student = "student",
}

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  email: string;

  @Column("text", { nullable: false, select: false })
  password: string;

  @Column("varchar", { length: 50, nullable: false })
  first_name: string;

  @Column("varchar", { length: 50, nullable: false })
  last_name: string;

  @Column("enum", {
    enum: USER_ROLE,
    enumName: "USER_ROLE",
    nullable: true,
  })
  role?: USER_ROLE;

  @Column()
  @CreateDateColumn()
  joined_on: Date;

  // available for both teacher & student
  // but student can only join one section
  @OneToMany(() => UsersToSections, (usersToSection) => usersToSection.user, {
    nullable: true,
  })
  userToSections?: UsersToSections[];

  @OneToMany(() => Class, (_class) => _class.host, { nullable: true })
  classes?: Class[];

  @ManyToOne(() => School, (school) => school.user, { nullable: true })
  school?: School;

  @OneToMany(
    () => Invitations_Joins,
    (invitations_joins) => invitations_joins.user,
    { nullable: true }
  )
  invitations_joins?: Invitations_Joins[];
}
