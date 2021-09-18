import { IsEnum } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import Class from "./classes.entity";
import Invitations_Joins from "./invitations_or_joins.entity";
import Notifications from "./notifications.entity";
import School from "./schools.entity";
import StudentsToSectionsToGrades from "./students_sections_grades.entity";
import TeachersToSectionsToGrades from "./teachers_sections_grades.entity";
import { UserSchema, USER_ROLE, USER_STATUS } from "@veschool/types";

@Entity("users")
export default class User implements UserSchema {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    email!: string;

    @Column("text", { nullable: false, select: false })
    password!: string;

    @Column("varchar", { length: 50, nullable: false })
    first_name!: string;

    @Column("varchar", { length: 50, nullable: false })
    last_name!: string;

    @IsEnum(USER_ROLE)
    @Column("varchar", { length: 20, nullable: true })
    role?: USER_ROLE | null;

    @Column()
    @CreateDateColumn()
    joined_on!: Date;

    @IsEnum(USER_STATUS)
    @Column("varchar", { length: 20, default: USER_STATUS.offline })
    status?: USER_STATUS;

    // relations

    @OneToMany(() => TeachersToSectionsToGrades, (tsg) => tsg.user, {
        nullable: true,
    })
    teachersToSectionsToGrades?: TeachersToSectionsToGrades[] | null;

    @OneToMany(
        () => StudentsToSectionsToGrades,
        (studentsToSectionsToGrade) => studentsToSectionsToGrade.user,
        {
            nullable: true,
        },
    )
    studentsToSectionsToGrade?: StudentsToSectionsToGrades[] | null;

    @OneToMany(() => Class, (_class) => _class.host, { nullable: true })
    classes?: Class[] | null;

    @OneToMany(() => Invitations_Joins, (invitations_joins) => invitations_joins.user, {
        nullable: true,
    })
    invitations_joins?: Invitations_Joins[] | null;

    @OneToMany(() => Notifications, (notifications) => notifications.user, {
        nullable: true,
    })
    notifications?: Notifications[] | null;

    @ManyToOne(() => School, (school) => school.users, { nullable: true })
    school?: School | null;

    // query / text search related

    @Column("tsvector", { select: false, nullable: true })
    query_common?: any | null;
}
