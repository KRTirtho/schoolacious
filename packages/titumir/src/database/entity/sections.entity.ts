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
import { SectionSchema } from "@schoolacious/types";
import Grade from "./grades.entity";
import StudentsToSectionsToGrades from "./students_sections_grades.entity";
import TeachersToSectionsToGrades from "./teachers_sections_grades.entity";
import User from "./users.entity";

@Entity("sections")
@Unique(["name", "grade"])
export default class Section implements SectionSchema {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @Column("varchar", { length: 100 })
    name!: string;

    @ManyToOne(() => Grade, (grade) => grade.sections)
    grade!: Grade;

    @OneToMany(() => TeachersToSectionsToGrades, (tsg) => tsg.section, {
        nullable: true,
    })
    teachersToSectionsToGrades?: TeachersToSectionsToGrades[] | null;

    @OneToMany(
        () => StudentsToSectionsToGrades,
        (studentsToSections) => studentsToSections.section,
        { nullable: true },
    )
    studentsToSectionsToGrade?: StudentsToSectionsToGrades[] | null;

    @OneToOne(() => User, { nullable: true })
    @JoinColumn()
    class_teacher?: User | null;
}
