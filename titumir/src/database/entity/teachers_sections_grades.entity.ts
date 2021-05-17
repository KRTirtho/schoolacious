import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import Grade from "./grades.entity";
import Section from "./sections.entity";
import Subject from "./subjects.entity";
import User from "./users.entity";

@Entity()
@Unique(["user", "section", "subject"])
@Unique(["section", "subject"])
export default class TeachersToSectionsToGrades {
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @ManyToOne(() => Grade, (grade) => grade.teachersToSectionsToGrades)
  grade!: Grade;

  @ManyToOne(() => User, (user) => user.teachersToSectionsToGrades)
  user!: User;

  @ManyToOne(() => Section, (section) => section.teachersToSectionsToGrades)
  section!: Section;

  @ManyToOne(() => Subject, (subject) => subject.teachersToSectionsToGrades)
  subject!: Subject;

  @Column()
  @CreateDateColumn()
  assigned_at!: Date;
}
