import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USERNAME,
    NODE_ENV,
} from "./config";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

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
};

export = ormconfig;
