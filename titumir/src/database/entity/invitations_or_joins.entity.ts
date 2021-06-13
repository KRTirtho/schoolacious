import { IsEnum } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import School from "./schools.entity";
import User from "./users.entity";

export enum INVITATION_OR_JOIN_TYPE {
    invitation = "invitation",
    join = "join",
}

export enum INVITATION_OR_JOIN_ROLE {
    teacher = "teacher",
    student = "student",
}

@Entity("invitations_or_joins")
@Unique(["user", "school"])
export default class Invitations_Joins {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @IsEnum(INVITATION_OR_JOIN_TYPE)
    @Column("varchar", { length: 15 })
    type!: INVITATION_OR_JOIN_TYPE;

    @ManyToOne(() => School, (school) => school.invitations_joins)
    school!: School;

    @ManyToOne(() => User, (user) => user.invitations_joins)
    user!: User;

    @Column()
    @CreateDateColumn()
    created_at!: Date;

    @IsEnum(INVITATION_OR_JOIN_ROLE)
    @Column("varchar", { length: 10 })
    role!: INVITATION_OR_JOIN_ROLE;
}
