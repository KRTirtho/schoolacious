import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import GradeToSubject from "./grade_subject.entity";
import School from "./schools.entity";
import Section from "./sections.entity";
import User from "./users.entity";
import UsersToSectionsToGrades from "./users_sections_grades.entity";

@Entity("grades")
@Unique(["standard", "school"])
export default class Grade {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column("int", { nullable: false })
  standard: number;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  moderator?: User;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  examiner?: User;

  @OneToMany(() => Section, (section) => section.grade, { nullable: true })
  sections?: Section[];

  @OneToMany(() => GradeToSubject, (grade_subject) => grade_subject.grade, {
    nullable: true,
  })
  grades_subjects?: GradeToSubject[];

  @OneToMany(
    () => UsersToSectionsToGrades,
    (usersToSectionsToGrade) => usersToSectionsToGrade.grade,
    { nullable: true }
  )
  usersToSectionsToGrade?: UsersToSectionsToGrades[];

  @ManyToOne(() => School, (school) => school.grades)
  school: School;
}
