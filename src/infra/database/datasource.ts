import { DataSource, DataSourceOptions } from "typeorm"
import * as dotenv from "dotenv"

dotenv.config()

const dataSourceConnection: DataSourceOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  synchronize: process.env.MYSQL_SYNCHRONIZE === "true",
  migrations: ["dist/infra/database/migrations/*.js"],
  migrationsRun: false,
  logging: true,
  migrationsTableName: "typeorm_migrations",
}

export default new DataSource(dataSourceConnection)
