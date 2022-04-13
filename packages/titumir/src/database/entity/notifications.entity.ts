import { IsEnum } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {
    NotificationsSchema,
    NOTIFICATION_INDICATOR_ICON,
    NOTIFICATION_STATUS,
} from "@schoolacious/types";
import User from "./users.entity";

@Entity("notifications")
export default class Notifications implements NotificationsSchema {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @Column("uuid")
    owner_id!: string;

    @Column("text")
    open_link!: string;

    @Column("varchar", { length: 50 })
    title!: string;

    @Column("text")
    description!: string;

    @Column("text")
    avatar_url!: string;

    @IsEnum(NOTIFICATION_INDICATOR_ICON)
    @Column("varchar", { length: 30 })
    type_indicator_icon!: NOTIFICATION_INDICATOR_ICON;

    @IsEnum(NOTIFICATION_STATUS)
    @Column("varchar", { length: 20, default: NOTIFICATION_STATUS.read })
    status!: NOTIFICATION_STATUS;

    @Column()
    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => User, (user) => user.notifications)
    receiver!: User;
}
