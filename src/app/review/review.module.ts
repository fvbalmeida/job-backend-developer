import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Review } from "./entities/review.entity"
import { User } from "../user/entities/user.entity"
import { Movie } from "../movie/entities/movie.entity"
import { ReviewController } from "./review.controller"
import { ReviewService } from "./review.service"
import { ReviewRepository } from "./repositories/review.repository"
import { OmdbService } from "../omdb/omdb.service"
import { RouteRequestModule } from "../requests/request.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, User, Movie]),
    RouteRequestModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, OmdbService],
})
export class ReviewModule {}
