import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Subject from "./subjects.entity";
import Grade from "./grades.entity";
import Invitations_Joins from "./invitations_or_joins.entity";
import User from "./users.entity";
import { SchoolSchema } from "@veschool/types";

@Entity("schools")
export default class School implements SchoolSchema {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @Column("text", { nullable: false })
    name!: string;

    @Column("varchar", { nullable: false, unique: true, length: 20 })
    short_name!: string;

    @Column("varchar", { length: 100, nullable: false, unique: true })
    email!: string;

    @Column("varchar", { nullable: false, unique: true, length: 15 })
    phone!: string;

    @Column("text")
    description!: string;

    @OneToOne(() => User)
    @JoinColumn()
    admin!: User;

    @OneToOne(() => User, { nullable: true })
    @JoinColumn()
    coAdmin1?: User | null;

    @OneToOne(() => User, { nullable: true })
    @JoinColumn()
    coAdmin2?: User | null;

    @Column()
    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => User, (user) => user.school, { nullable: true })
    users?: User[] | null;

    @OneToMany(() => Grade, (grade) => grade.school, { nullable: true })
    grades?: Grade[] | null;

    @OneToMany(() => Invitations_Joins, (invitations_joins) => invitations_joins.school, {
        nullable: true,
    })
    invitations_joins?: Invitations_Joins[] | null;

    @OneToMany(() => Subject, (subject) => subject.school, { nullable: true })
    subjects?: Subject[] | null;

    // query / text search related

    @Column("tsvector", { select: false, nullable: true })
    query_common?: any | null;
}
