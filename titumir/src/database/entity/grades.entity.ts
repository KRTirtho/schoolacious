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

  @ManyToOne(() => School, (school) => school.grades)
  school: School;

  @Column()
  @CreateDateColumn()
  created_at: string;

  @OneToMany(() => Section, (section) => section.grade)
  sections: Section[];

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  moderator?: User;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  examiner?: User;

  @OneToMany(() => GradeToSubject, (grade_subject) => grade_subject.grade)
  grades_subjects: GradeToSubject[];

  @OneToMany(
    () => UsersToSectionsToGrades,
    (usersToSectionsToGrade) => usersToSectionsToGrade.grade,
    { nullable: true }
  )
  usersToSectionsToGrade: UsersToSectionsToGrades[];
}
