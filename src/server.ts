import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import App from "./app";
import config from "./ormconfig";
import validateEnv from "./utils/validateEnv";

validateEnv();

(async () => {
  // try {
  //   const connection = new DataSource(config);
  //   await connection.initialize();
  //   await connection.runMigrations();
  // } catch (error) {
  //   console.log("Error while connecting to the database", error);
  //   return error;
  // }

  const app = new App([
  ]);

  app.listen();
})();
