import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
} from "config";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const config: PostgresConnectionOptions = {
  type: "postgres",
  database: DATABASE_NAME,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  password: DATABASE_PASSWORD,
  uuidExtension: "uuid-ossp",
  migrations: ["./dist/veschool/migrations/*.js"],
  cli: {
    migrationsDir: "veschool/migrations",
  },
  synchronize: true,
};

export default config;
