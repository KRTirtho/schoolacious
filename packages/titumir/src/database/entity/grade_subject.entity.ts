import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { GradeToSubjectSchema } from "@veschool/types";
import Grade from "./grades.entity";
import Subject from "./subjects.entity";

@Entity()
@Unique(["grade", "subject"])
export default class GradeToSubject implements GradeToSubjectSchema {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @ManyToOne(() => Grade, (grade) => grade.grades_subjects)
    grade!: Grade;

    @ManyToOne(() => Subject, (subject) => subject.grades_subjects)
    subject!: Subject;

    @Column("int", { default: 100 })
    mark!: number;
}
