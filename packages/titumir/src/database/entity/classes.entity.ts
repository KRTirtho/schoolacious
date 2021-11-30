import { IsEnum, Max, Min } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { ClassSchema, CLASS_STATUS } from "@veschool/types";
import TeachersToSectionsToGrades from "./teachers_sections_grades.entity";

@Entity("classes")
export default class Class implements ClassSchema {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @Column()
    @CreateDateColumn()
    created_at!: Date;

    @Max(6)
    @Min(0)
    @Column("int")
    day!: number;

    @Column("time")
    time!: string;

    @ManyToOne(() => TeachersToSectionsToGrades, (tsg) => tsg.classes)
    host!: TeachersToSectionsToGrades;

    @IsEnum(CLASS_STATUS)
    @Column("varchar", { length: 20 })
    status!: CLASS_STATUS;

    @Max(3600) // 1hr
    @Min(600) // 10min
    @Column({ type: "int" })
    duration!: number;

    @Column("varchar", { length: 20, nullable: true })
    sessionId?: string;
}
