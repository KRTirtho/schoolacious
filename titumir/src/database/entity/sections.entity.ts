import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import Class from "./classes.entity";
import Grade from "./grades.entity";
import UsersToSectionsToGrades from "./users_sections_grades.entity";

@Entity("sections")
@Unique(["name", "grade"])
export default class Section {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column("varchar", { length: 100, nullable: false })
  name: string;

  @ManyToOne(() => Grade, (grade) => grade.sections)
  grade: Grade;

  @OneToMany(
    () => UsersToSectionsToGrades,
    (usersToSections) => usersToSections.section,
    { nullable: true }
  )
  usersToSectionToGrades: UsersToSectionsToGrades[];

  @OneToMany(() => Class, (_class) => _class.section)
  classes: Class[];
}
