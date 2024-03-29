import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AuthModule } from "./app/auth/auth.module"
import { MovieModule } from "./app/movie/movie.module"
import { OmdbModule } from "./app/omdb/omdb.module"
import { ReviewModule } from "./app/review/review.module"
import { UserModule } from "./app/user/user.module"
import { connectionSource } from "./infra/database/datasource"

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionSource),
    ConfigModule.forRoot({ isGlobal: true }),
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
