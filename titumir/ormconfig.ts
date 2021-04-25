import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  NODE_ENV,
} from "./config";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const ormconfig: PostgresConnectionOptions = {
  type: "postgres",
  database: DATABASE_NAME,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  password: DATABASE_PASSWORD,
  uuidExtension: "uuid-ossp",
  logging: NODE_ENV !== "test",
  migrations: ["./dist/veschool/migrations/*.js"],
  cli: {
    migrationsDir: "veschool/migrations",
  },
  synchronize: true,
};

export default ormconfig;
