import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Section from "./sections.entity";
import User from "./users.entity";

export enum SECTION_ROLE {
  teacher = "teacher",
  student = "student",
}

@Entity()
export default class UsersToSections {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  user_id: string;

  @Column()
  section_id: string;

  @ManyToOne(() => User, (user) => user.userToSections)
  user: User;

  @ManyToOne(() => Section, (section) => section.usersToSections)
  section: Section;

  @Column()
  @CreateDateColumn()
  assigned_at: Date;

  @Column("enum", {
    enum: SECTION_ROLE,
    nullable: false,
    enumName: "SECTION_ROLE",
  })
  role: SECTION_ROLE;
}
