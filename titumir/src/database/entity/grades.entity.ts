import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Section from "./sections.entity";
import User from "./users.entity";

@Entity("grades")
export default class Grade {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column("int", { nullable: false })
  standard: number;

  @OneToMany(() => Section, (section) => section.grade)
  sections: Section[];

  @OneToOne(() => User)
  @JoinColumn()
  moderator: User;

  @OneToOne(() => User)
  @JoinColumn()
  examiner: User;
}
