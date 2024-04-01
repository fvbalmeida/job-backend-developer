import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"

import { Movie } from "../movie/entities/movie.entity"
import { OmdbService } from "../omdb/omdb.service"
import { GetAllReviewsDto } from "./dto/get-all-reviews.dto"
import { Review } from "./entities/review.entity"
import { ReviewRepository } from "./repositories/review.repository"
import { CreateReviewDto } from "./dto/create-review.dto"
import { UpdateReviewDto } from "./dto/update-review.dto"
import {
  CreateReviewResponse,
  DeleteReviewResponse,
} from "@/shared/types/review.types"
import {
  SimilarVideosFoundException,
  MultipleMoviesFoundException,
  TitleNotMatchImdbIDException,
  ReviewNotFoundOrIsNotOwnerException,
  CheckIfReviewAlreadyExistsException,
} from "@/shared/exceptions/review.service.exceptions"
import {
  SearchByTitleResponse,
  getByImdbIDResponse,
} from "@/shared/types/omdb.types"

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly omdbService: OmdbService,
  ) {}

  async createReview(
    userId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<CreateReviewResponse> {
    const moviesListFromOmdb = await this.omdbService.searchMoviesByTitle(
      createReviewDto.title,
    )

    const strictMovieTitle = this.filterMoviesByTitle(
      moviesListFromOmdb,
      createReviewDto.title,
    )

    if (strictMovieTitle.length === 0 && !createReviewDto.imdbID) {
      throw new SimilarVideosFoundException(moviesListFromOmdb)
    }

    if (strictMovieTitle.length > 1 && !createReviewDto.imdbID) {
      throw new MultipleMoviesFoundException(strictMovieTitle)
    }

    const imdbID = createReviewDto.imdbID || strictMovieTitle[0].imdbID
    const movieInfo = await this.omdbService.getMovieByImdbID(imdbID)

    if (movieInfo.Title.toLowerCase() !== createReviewDto.title.toLowerCase()) {
      throw new TitleNotMatchImdbIDException(movieInfo.Title, imdbID)
    }

    await this.checkIfReviewAlreadyExists(userId, imdbID)

    const movie = this.createMovieEntity(movieInfo)
    const newReview = this.createReviewEntity(
      createReviewDto.review,
      movie,
      userId,
    )

    try {
      return await this.reviewRepository.createReview(movie, newReview)
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to create review. Please try again.",
      )
    }
  }

  private filterMoviesByTitle(movies: SearchByTitleResponse[], title: string) {
    return movies.filter(
      (movie) => movie.Title.toLowerCase() === title.toLowerCase(),
    )
  }

  private async checkIfReviewAlreadyExists(userId: number, imdbID: string) {
    const reviewAlreadyExists =
      await this.reviewRepository.userHasReviewedMovie(userId, imdbID)
    if (reviewAlreadyExists) {
      throw new CheckIfReviewAlreadyExistsException(reviewAlreadyExists.id)
    }
  }

  private createMovieEntity(movieInfo: getByImdbIDResponse): Movie {
    return new Movie({
      title: movieInfo.Title,
      released: new Date(movieInfo.Released),
      imdbRating: movieInfo.imdbRating,
      imdbID: movieInfo.imdbID,
      actors: movieInfo.Actors,
      director: movieInfo.Director,
    })
  }

  private createReviewEntity(
    review: string,
    movie: Movie,
    userId: number,
  ): Review {
    return this.reviewRepository.create({
      review,
      movie,
      user: { id: userId },
    })
  }

  async getAllReviews(getAllReviewsDto: GetAllReviewsDto): Promise<Review[]> {
    const reviews = await this.reviewRepository.getAllReviews(getAllReviewsDto)
    if (reviews.length === 0) {
      throw new NotFoundException("No reviews found")
    }

    return reviews
  }

  async getReviewById(reviewId: number): Promise<Review> {
    const review = await this.reviewRepository.getReviewById(reviewId)
    if (!review) {
      throw new NotFoundException(`Review with ID: ${reviewId} not found`)
    }
    return review
  }

  async updateReview(
    userId: number,
    reviewId: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const isOwnerOrExists = await this.reviewRepository.isOwner(
      userId,
      reviewId,
    )
    if (!isOwnerOrExists) {
      throw new ReviewNotFoundOrIsNotOwnerException()
    }

    try {
      await this.reviewRepository.updateReview(
        userId,
        reviewId,
        updateReviewDto,
      )
      const updatedReview = await this.reviewRepository.getReviewById(reviewId)
      return updatedReview
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update review with ID: ${reviewId}`,
      )
    }
  }

  async deleteReview(
    userId: number,
    reviewId: number,
  ): Promise<DeleteReviewResponse> {
    const isOwnerOrExists = await this.reviewRepository.isOwner(
      userId,
      reviewId,
    )
    if (!isOwnerOrExists) {
      throw new ReviewNotFoundOrIsNotOwnerException()
    }
    try {
      await this.reviewRepository.deleteReview(userId, reviewId)
      return { message: `Review with ID: ${reviewId} deleted successfully` }
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete review with ID: ${reviewId}`,
      )
    }
  }
}
