import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Grade from "./grades.entity";
import Invitations_Joins from "./invitations_or_joins.entity";
import User from "./users.entity";

@Entity("schools")
export default class School {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column("text", { nullable: false })
  name: string;

  @Column("varchar", { nullable: false, unique: true, length: 20 })
  short_name: string;

  @Column("varchar", { length: 100, nullable: false, unique: true })
  email: string;

  @Column("varchar", { nullable: false, unique: true, length: 15 })
  phone: string;

  @Column("text")
  description: string;

  @OneToOne(() => User)
  @JoinColumn()
  admin: User;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  coAdmin1?: User;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  coAdmin2?: User;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => User, (user) => user.school, { nullable: true })
  users?: User[];

  @OneToMany(() => Grade, (grade) => grade.school, { nullable: true })
  grades?: Grade[];

  @OneToMany(
    () => Invitations_Joins,
    (invitations_joins) => invitations_joins.school
  )
  invitations_joins?: Invitations_Joins[];
}
