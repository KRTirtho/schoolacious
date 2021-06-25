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
import User from "./users.entity";

@Entity()
@Unique(["grade", "section", "user"])
export default class StudentsToSectionsToGrades {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @ManyToOne(() => Grade, (grade) => grade.studentsToSectionsToGrade)
    grade!: Grade;

    @ManyToOne(() => User, (user) => user.studentsToSectionsToGrade)
    user!: User;

    @ManyToOne(() => Section, (section) => section.studentsToSectionsToGrade)
    section!: Section;

    @Column()
    @CreateDateColumn()
    assigned_at!: Date;
}
