import { Repository } from "typeorm"

import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { RouteRequest } from "./entities/request.entity"
import { Review } from "../review/entities/review.entity"

@Injectable()
export class RouteRequestService {
  constructor(
    @InjectRepository(RouteRequest)
    private readonly routeRequestRepository: Repository<RouteRequest>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getMostViewedReviews() {
    // get the review title
    return this.routeRequestRepository
      .createQueryBuilder("request")
      .leftJoinAndSelect("request.review", "review")
      .leftJoinAndSelect("review.movie", "movie")
      .select([
        "request.reviewId",
        "movie.title",
        "COUNT(request.reviewId) AS views",
      ])
      .groupBy("request.reviewId")
      .addGroupBy("movie.title")
      .orderBy("views", "DESC")
      .getRawMany()
  }

  async saveRequestDetails(method: string, path: string, reviewId: number) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    })

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`)
    }

    return this.routeRequestRepository.save({
      method,
      path,
      review,
      statusCode: 200,
    })
  }
}
