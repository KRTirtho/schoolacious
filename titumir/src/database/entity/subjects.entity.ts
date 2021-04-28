import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import GradeToSubject from "./grade_subject.entity";
import School from "./schools.entity";

@Entity("subjects")
@Unique(["name", "school"])
export default class Subject {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column("varchar", { length: 50 })
  name: string;

  @Column("text")
  description: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => School, (school) => school.subjects)
  school: School;

  @OneToMany(() => GradeToSubject, (grade_subject) => grade_subject.subject)
  grades_subjects: GradeToSubject[];
}
