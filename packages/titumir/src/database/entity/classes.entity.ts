import { IsEnum, Max, Min } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { ClassSchema, CLASS_STATUS } from "@veschool/types";
import Section from "./sections.entity";
import User from "./users.entity";

@Entity("classes")
export default class Class implements ClassSchema {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @Column()
    @CreateDateColumn()
    created_at!: Date;

    @Column("int")
    day!: number;

    @Column("time")
    time!: string;

    @ManyToOne(() => Section, (section) => section.classes)
    section!: Section;

    @ManyToOne(() => User, (user) => user.classes)
    host!: User;

    @IsEnum(CLASS_STATUS)
    @Column("varchar", { length: 20 })
    status!: CLASS_STATUS;

    @Max(3600) // 1hr
    @Min(600) // 10min
    @Column({ type: "int" })
    duration!: number;
}
