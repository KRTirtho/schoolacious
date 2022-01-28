import { IsEnum } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import {
    Invitations_JoinsSchema,
    INVITATION_OR_JOIN_ROLE,
    INVITATION_OR_JOIN_TYPE,
} from "@schoolacious/types";
import School from "./schools.entity";
import User from "./users.entity";

@Entity("invitations_or_joins")
@Unique(["user", "school"])
export default class Invitations_Joins implements Invitations_JoinsSchema {
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
