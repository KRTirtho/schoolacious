import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "../../ormconfig";
import Class from "./entity/classes.entity";
import Grade from "./entity/grades.entity";
import GradeToSubject from "./entity/grade_subject.entity";
import Invitations_Joins from "./entity/invitations_or_joins.entity";
import School from "./entity/schools.entity";
import Section from "./entity/sections.entity";
import Subject from "./entity/subjects.entity";
import User from "./entity/users.entity";
import UsersToSections from "./entity/user_section.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormconfig,
      entities: [
        User,
        Section,
        Grade,
        UsersToSections,
        Class,
        School,
        Invitations_Joins,
        Subject,
        GradeToSubject,
      ],
    }),
  ],
})
export class DatabaseModule {}
