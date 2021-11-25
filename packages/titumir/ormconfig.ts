import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USERNAME,
    NODE_ENV,
} from "./config";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import Class from "./src/database/entity/classes.entity";
import Grade from "./src/database/entity/grades.entity";
import GradeToSubject from "./src/database/entity/grade_subject.entity";
import Invitations_Joins from "./src/database/entity/invitations_or_joins.entity";
import Notifications from "./src/database/entity/notifications.entity";
import School from "./src/database/entity/schools.entity";
import Section from "./src/database/entity/sections.entity";
import StudentsToSectionsToGrades from "./src/database/entity/students_sections_grades.entity";
import TeachersToSectionsToGrades from "./src/database/entity/teachers_sections_grades.entity";
import User from "./src/database/entity/users.entity";
import Subject from "./src/database/entity/subjects.entity";

const ormconfig: PostgresConnectionOptions = {
    type: "postgres",
    username: DATABASE_USERNAME,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    password: DATABASE_PASSWORD,
    uuidExtension: "uuid-ossp",
    logging: NODE_ENV !== "test",
    migrations: ["./dist/src/database/migrations/*.js"],
    cli: {
        migrationsDir: "./src/database/migrations",
    },
    synchronize: true,
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
};

export = {
    ...ormconfig,
    seeds: ["src/database/seeds/*{.ts,.js}"],
    factories: ["src/database/factories/*{.ts,.js}"],
};
