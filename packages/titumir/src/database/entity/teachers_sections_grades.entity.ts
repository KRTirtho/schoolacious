import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import { TeachersToSectionsToGradesSchema } from "@veschool/types";
import Grade from "./grades.entity";
import Section from "./sections.entity";
import Subject from "./subjects.entity";
import User from "./users.entity";
import Class from "./classes.entity";

@Entity()
@Unique(["user", "section", "subject"])
@Unique(["section", "subject"])
export default class TeachersToSectionsToGrades
    implements TeachersToSectionsToGradesSchema
{
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

    @OneToMany(() => Class, (c) => c.host, { nullable: true })
    classes?: Class[] | null;

    @Column()
    @CreateDateColumn()
    assigned_at!: Date;
}
