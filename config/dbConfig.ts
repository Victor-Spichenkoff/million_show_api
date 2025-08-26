import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'node:path';
import {configDotEnvFile} from "./dotenv";

configDotEnvFile()

console.log("DB: " + process.env.DB_PATH)
export const dbConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: process.env.DB_PATH,
  // database: path.join(__dirname, 'db', 'type_orm.sqlite'),
  entities: [path.join(__dirname, "..", "models/**.model{.js,.ts}")],
  synchronize: true
}
