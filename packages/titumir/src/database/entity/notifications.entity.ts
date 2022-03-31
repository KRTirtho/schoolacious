import { IsEnum } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { NotificationsSchema, NOTIFICATION_STATUS } from "@schoolacious/types";
import User from "./users.entity";

@Entity("notifications")
export default class Notifications implements NotificationsSchema {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @ManyToOne(() => User, (user) => user.notifications)
    user!: User;

    @Column("text")
    message!: string;

    @Column("varchar", { length: 100 })
    src!: string;

    @IsEnum(NOTIFICATION_STATUS)
    @Column("varchar", { length: 20 })
    status!: NOTIFICATION_STATUS;

    @Column()
    @CreateDateColumn()
    created_at!: Date;
}
