import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import Class from "./classes.entity";
import Grade from "./grades.entity";
import User from "./users.entity";
import UsersToSectionsToGrades from "./users_sections_grades.entity";

@Entity("sections")
@Unique(["name", "grade"])
export default class Section {
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @Column("varchar", { length: 100 })
  name!: string;

  @ManyToOne(() => Grade, (grade) => grade.sections)
  grade!: Grade;

  @OneToMany(
    () => UsersToSectionsToGrades,
    (usersToSections) => usersToSections.section,
    { nullable: true }
  )
  usersToSectionToGrades?: UsersToSectionsToGrades[] | null;

  @OneToMany(() => Class, (_class) => _class.section, { nullable: true })
  classes?: Class[] | null;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  class_teacher?: User | null;
}
