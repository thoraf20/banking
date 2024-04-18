import "dotenv/config";
import "reflect-metadata";
import App from "./app";
import validateEnv from "./utils/validateEnv";
import AuthenticationController from "./auth/auth.controller";
import dbConfig from "./ormconfig";

validateEnv();

(async () => {
  try {
    const connection = dbConfig;
    await connection.initialize();
    // await connection.runMigrations();
  } catch (error) {
    console.log("Error while connecting to the database", error);
    return error;
  }

  const app = new App([
    new AuthenticationController()
  ]);

  app.listen();
})();
