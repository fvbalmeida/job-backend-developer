import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Movie } from "./entities/movie.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
})
export class MovieModule {}
