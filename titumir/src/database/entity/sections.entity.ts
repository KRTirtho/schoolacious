import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Class from "./classes.entity";
import Grade from "./grades.entity";
import UsersToSections from "./user_section.entity";

@Entity("sections")
export default class Section {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column("varchar", { length: 100, nullable: false })
  name: string;

  @ManyToOne(() => Grade, (grade) => grade.sections)
  grade: Grade;

  @OneToMany(
    () => UsersToSections,
    (usersToSections) => usersToSections.section
  )
  usersToSections: UsersToSections[];

  @OneToMany(() => Class, (_class) => _class.section)
  classes: Class[];
}
