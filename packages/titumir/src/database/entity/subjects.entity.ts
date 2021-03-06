import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import { SubjectSchema } from "@schoolacious/types";
import GradeToSubject from "./grade_subject.entity";
import School from "./schools.entity";
import TeachersToSectionsToGrades from "./teachers_sections_grades.entity";

@Entity("subjects")
@Unique(["name", "school"])
export default class Subject implements SubjectSchema {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @Column("varchar", { length: 50 })
    name!: string;

    @Column("text")
    description!: string;

    @Column()
    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => School, (school) => school.subjects)
    school!: School;

    @OneToMany(() => GradeToSubject, (grade_subject) => grade_subject.subject, {
        nullable: true,
    })
    grades_subjects?: GradeToSubject[] | null;

    @OneToMany(() => TeachersToSectionsToGrades, (tsg) => tsg.subject, {
        nullable: true,
    })
    teachersToSectionsToGrades?: TeachersToSectionsToGrades[] | null;
}
