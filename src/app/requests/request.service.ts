import { Repository } from "typeorm"

import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { Review } from "../review/entities/review.entity"
import { RouteRequestRepository } from "./repositories/request.repository"

@Injectable()
export class RouteRequestService {
  constructor(
    private readonly routeRequestRepository: RouteRequestRepository,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getMostViewedReviews() {
    const mostViewed = await this.routeRequestRepository.getMostViewedReviews()
    if (!mostViewed.length) {
      throw new NotFoundException("Nothing to show here!")
    }
    return mostViewed
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
