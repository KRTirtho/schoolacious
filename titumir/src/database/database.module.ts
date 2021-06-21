import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "../../ormconfig";
import Class from "./entity/classes.entity";
import Grade from "./entity/grades.entity";
import GradeToSubject from "./entity/grade_subject.entity";
import Invitations_Joins from "./entity/invitations_or_joins.entity";
import Notifications from "./entity/notifications.entity";
import School from "./entity/schools.entity";
import Section from "./entity/sections.entity";
import StudentsToSectionsToGrades from "./entity/students_sections_grades.entity";
import Subject from "./entity/subjects.entity";
import TeachersToSectionsToGrades from "./entity/teachers_sections_grades.entity";
import User from "./entity/users.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...ormconfig,
            entities: [
                User,
                Section,
                Grade,
                Class,
                School,
                Invitations_Joins,
                Subject,
                GradeToSubject,
                StudentsToSectionsToGrades,
                TeachersToSectionsToGrades,
                Notifications,
            ],
        }),
    ],
})
export class DatabaseModule {}
