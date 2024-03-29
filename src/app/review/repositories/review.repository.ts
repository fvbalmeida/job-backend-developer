import { DataSource, Repository } from "typeorm"

import { Injectable } from "@nestjs/common"

import { Movie } from "@/app/movie/entities/movie.entity"
import { GetAllReviewsDto } from "../dto/get-all-reviews.dto"
import { Review } from "../entities/review.entity"

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private dataSource: DataSource) {
    super(Review, dataSource.createEntityManager())
  }

  async createReview(movie: Movie, reviewData: Review) {
    return this.dataSource
      .createEntityManager()
      .transaction(async (manager) => {
        const newMovie = await manager.save(movie)
        reviewData.movie = newMovie
        const newReview = await manager.save(reviewData)
        return newReview
      })
  }

  async userHasReviewedMovie(userId: number, imdbID: string) {
    return this.dataSource
      .createQueryBuilder(Review, "review")
      .leftJoinAndSelect("review.movie", "movie")
      .where("movie.imdbID = :imdbID", { imdbID })
      .andWhere("review.UserId = :userId", { userId })
      .getOne()
  }

  async getAllReviews(getAllReviewsDto: GetAllReviewsDto) {
    const { page, limit, sort, order, filter } = getAllReviewsDto
    return this.dataSource
      .createQueryBuilder(Review, "review")
      .leftJoinAndSelect("review.movie", "movie")
      .where(
        "movie.title LIKE :filter OR movie.actors LIKE :filter OR movie.director LIKE :filter",
        { filter: `%${filter}%` },
      )
      .orderBy(sort, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany()
  }

  async getReviewById(userId: number, reviewID: number) {
    return this.dataSource
      .createQueryBuilder(Review, "review")
      .leftJoinAndSelect("review.movie", "movie")
      .where("review.id = :reviewID", { reviewID })
      .andWhere("review.userId = :userId", { userId })
      .getOne()
  }

  async updateReview(
    userId: number,
    reviewID: number,
    review: Partial<Review>,
  ) {
    return this.dataSource
      .createQueryBuilder(Review, "review")
      .update(Review)
      .set(review)
      .where("review.id = :reviewID", { reviewID })
      .andWhere("review.userId = :userId", { userId })
      .execute()
  }

  async deleteReview(userId: number, reviewID: number) {
    return this.dataSource
      .createQueryBuilder(Review, "review")
      .delete()
      .where("review.id = :reviewID", { reviewID })
      .andWhere("review.userid = :userId", { userId })
      .execute()
  }
}
