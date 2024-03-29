import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AuthModule } from "./app/auth/auth.module"
import { MovieModule } from "./app/movie/movie.module"
import { OmdbModule } from "./app/omdb/omdb.module"
import { ReviewModule } from "./app/review/review.module"
import { UserModule } from "./app/user/user.module"
import { DatabaseModule } from "./infra/database/database.module"
import { dbConfig } from "./infra/database/db.config"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dbConfig,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ReviewModule,
    UserModule,
    MovieModule,
    AuthModule,
    OmdbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
