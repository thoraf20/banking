import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Customer } from "./customers/customer.entity";

dotenv.config();

const dbConfig = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Customer],
  migrations: ["dist/migrations/*{.ts,.js}"],
  migrationsTableName: "banking_migrations",
  synchronize: false,
  logging: ["error"],
});

export = dbConfig;
