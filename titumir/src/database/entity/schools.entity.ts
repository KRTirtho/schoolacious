import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./users.entity";

@Entity("schools")
export default class School {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column("text", { nullable: false, unique: true })
  name: string;

  @Column("varchar", { length: 100, nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  phone: number;

  @Column("text")
  description: string;

  @OneToOne(() => User)
  @JoinColumn()
  admin: User;

  @JoinColumn()
  @OneToOne(() => User)
  coAdmin1: string;

  @JoinColumn()
  @OneToOne(() => User)
  coAdmin2: string;
}
