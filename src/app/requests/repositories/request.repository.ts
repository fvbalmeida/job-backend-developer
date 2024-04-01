import { DataSource, Repository } from "typeorm"

import { Injectable } from "@nestjs/common"

import { RouteRequest } from "../entities/request.entity"

@Injectable()
export class RouteRequestRepository extends Repository<RouteRequest> {
  constructor(private dataSource: DataSource) {
    super(RouteRequest, dataSource.createEntityManager())
  }

  async getMostViewedReviews() {
    return this.dataSource
      .createQueryBuilder(RouteRequest, "request")
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
}
