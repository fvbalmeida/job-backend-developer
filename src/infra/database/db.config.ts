import * as dotenv from "dotenv"

import { TypeOrmModuleOptions } from "@nestjs/typeorm"

import { User } from "@/app/user/entities/user.entity"
import { Review } from "@/app/review/entities/review.entity"
import { Movie } from "@/app/movie/entities/movie.entity"
import { RouteRequest } from "@/app/requests/entities/request.entity"

dotenv.config()

export const dbConfig: TypeOrmModuleOptions = {
  type: "mysql" as const,
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  synchronize: process.env.MYSQL_SYNCHRONIZE === "true",
  migrationsRun: process.env.MYSQL_MIGRATIONS_RUN === "true",
  logging: true,
  entities: [User, Review, Movie, RouteRequest],
}
