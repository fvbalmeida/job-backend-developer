import { ConfigService } from "@nestjs/config"

import { User } from "@/app/user/entities/user.entity"
import { Review } from "@/app/review/entities/review.entity"
import { Movie } from "@/app/movie/entities/movie.entity"

export const dbConfig = (configService: ConfigService) => ({
  type: "mysql" as const,
  host: configService.get<string>("MYSQL_HOST"),
  port: configService.get<number>("MYSQL_PORT"),
  database: configService.get<string>("MYSQL_DATABASE"),
  username: configService.get<string>("MYSQL_USERNAME"),
  password: configService.get<string>("MYSQL_PASSWORD"),
  synchronize: configService.get<string>("MYSQL_SYNCHRONIZE") === "true",
  migrationsRun: false,
  logging: true,
  entities: [User, Review, Movie],
})
