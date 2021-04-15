import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Section from "./sections.entity";
import User from "./users.entity";

@Entity("classes")
export default class Class {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column("date", { nullable: false })
  scheduled_at: Date;

  @ManyToOne(() => Section, (section) => section.classes)
  section: Section;

  @ManyToOne(() => User, (user) => user.classes)
  host: User;
}
