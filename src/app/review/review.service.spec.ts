import { getRepositoryToken } from "@nestjs/typeorm"
import { TestingModule, Test } from "@nestjs/testing"
import { InternalServerErrorException, NotFoundException } from "@nestjs/common"

import { OmdbService } from "../omdb/omdb.service"
import { ReviewRepository } from "./repositories/review.repository"
import { ReviewService } from "./review.service"
import {
  imdbIDSearchResponse,
  omdbServiceMock,
  reviewMock,
  reviewRepositoryMock,
  titleSearchResponse,
} from "@/shared/__mocks__/review.mock"
import {
  CheckIfReviewAlreadyExistsException,
  MultipleMoviesFoundException,
  ReviewNotFoundOrIsNotOwnerException,
  SimilarVideosFoundException,
  TitleNotMatchImdbIDException,
} from "@/shared/exceptions/review.service.exceptions"

describe("ReviewService Test", () => {
  let reviewService: ReviewService
  let reviewRepository: ReviewRepository
  let omdbService: OmdbService

  const movieBodyRequestMock = {
    title: "Filme Mock",
    review: "Excelente mock de review!",
    imdbID: "tt12345",
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        OmdbService,
        {
          provide: getRepositoryToken(ReviewRepository),
          useValue: reviewRepositoryMock.useValue,
        },
        {
          provide: OmdbService,
          useValue: omdbServiceMock.useValue,
        },
      ],
    }).compile()

    reviewService = moduleFixture.get<ReviewService>(ReviewService)
    reviewRepository = moduleFixture.get<ReviewRepository>(
      getRepositoryToken(ReviewRepository),
    )
    omdbService = moduleFixture.get<OmdbService>(OmdbService)
  })

  it("Should be defined", () => {
    expect(reviewService).toBeDefined()
    expect(reviewRepository).toBeDefined()
    expect(omdbService).toBeDefined()
  })

  it("Should create a review", async () => {
    omdbService.searchMoviesByTitle = jest
      .fn()
      .mockReturnValueOnce(titleSearchResponse)
    omdbService.getMovieByImdbID = jest
      .fn()
      .mockReturnValueOnce(imdbIDSearchResponse)
    reviewRepository.userHasReviewedMovie = jest.fn().mockReturnValueOnce(null)
    const result = await reviewService.createReview(1, movieBodyRequestMock)

    expect(result).toEqual(reviewMock)
    expect(reviewRepository.createReview).toHaveBeenCalledTimes(1)
    expect(reviewRepository.userHasReviewedMovie).toHaveBeenCalledWith(
      1,
      movieBodyRequestMock.imdbID,
    )
    expect(omdbService.searchMoviesByTitle).toHaveBeenCalledWith(
      movieBodyRequestMock.title,
    )
    expect(omdbService.getMovieByImdbID).toHaveBeenCalledWith(
      movieBodyRequestMock.imdbID,
    )
  })

  it("Should throw MultipleMoviesFoundException when searching by title and multiple movies are found", async () => {
    omdbService.searchMoviesByTitle = jest
      .fn()
      .mockReturnValueOnce(titleSearchResponse.concat(titleSearchResponse))

    await expect(
      reviewService.createReview(1, {
        title: movieBodyRequestMock.title,
        review: movieBodyRequestMock.review,
      }),
    ).rejects.toThrow(MultipleMoviesFoundException)
  })

  it("Should throw SimilarVideosFoundException when no strict movie title found and imdbID not provided", async () => {
    omdbService.searchMoviesByTitle = jest.fn().mockReturnValueOnce([])

    await expect(
      reviewService.createReview(1, {
        title: movieBodyRequestMock.title,
        review: movieBodyRequestMock.review,
      }),
    ).rejects.toThrow(SimilarVideosFoundException)
  })

  it("should thwrow TitleNotMatchImdbIDException when movie title does not match imdbID", async () => {
    omdbService.searchMoviesByTitle = jest
      .fn()
      .mockReturnValueOnce(titleSearchResponse)
    omdbService.getMovieByImdbID = jest
      .fn()
      .mockReturnValueOnce(imdbIDSearchResponse)

    await expect(
      reviewService.createReview(1, {
        title: "Filme Mock 2",
        review: movieBodyRequestMock.review,
        imdbID: movieBodyRequestMock.imdbID,
      }),
    ).rejects.toThrow(TitleNotMatchImdbIDException)
  })

  it("should throw CheckIfReviewAlreadyExistsException error when user already reviewed movie", async () => {
    omdbService.searchMoviesByTitle = jest
      .fn()
      .mockReturnValueOnce(titleSearchResponse)
    omdbService.getMovieByImdbID = jest
      .fn()
      .mockReturnValueOnce(imdbIDSearchResponse)
    reviewRepository.userHasReviewedMovie = jest
      .fn()
      .mockReturnValueOnce(reviewMock)

    await expect(
      reviewService.createReview(1, movieBodyRequestMock),
    ).rejects.toThrow(CheckIfReviewAlreadyExistsException)
  })

  it("should throw InternalServerErrorException when failed to create review", async () => {
    omdbService.searchMoviesByTitle = jest
      .fn()
      .mockReturnValueOnce(titleSearchResponse)
    omdbService.getMovieByImdbID = jest
      .fn()
      .mockReturnValueOnce(imdbIDSearchResponse)
    reviewRepository.userHasReviewedMovie = jest.fn().mockReturnValueOnce(null)
    reviewRepository.createReview = jest.fn().mockRejectedValueOnce(new Error())

    await expect(
      reviewService.createReview(1, movieBodyRequestMock),
    ).rejects.toThrow(InternalServerErrorException)
  })

  it("should get all reviews", async () => {
    reviewRepository.getAllReviews = jest
      .fn()
      .mockResolvedValueOnce([reviewMock])

    const result = await reviewService.getAllReviews({ page: 1 })

    expect(result).toEqual([reviewMock])
    expect(reviewRepository.getAllReviews).toHaveBeenCalledTimes(1)
  })

  it("should throw NotFoundException when no reviews found", async () => {
    reviewRepository.getAllReviews = jest.fn().mockResolvedValueOnce([])

    await expect(reviewService.getAllReviews({ page: 1 })).rejects.toThrow(
      NotFoundException,
    )
  })

  it("Should get a review by ID", async () => {
    const result = await reviewService.getReviewById(1)

    expect(result).toEqual(reviewMock)
    expect(reviewRepository.getReviewById).toHaveBeenCalledTimes(1)
  })

  it("Should throw NotFoundException when review not found", async () => {
    reviewRepository.getReviewById = jest.fn().mockResolvedValueOnce(null)

    await expect(reviewService.getReviewById(1)).rejects.toThrow(
      NotFoundException,
    )
  })

  it("Should update a review", async () => {
    reviewRepository.updateReview = jest.fn().mockResolvedValue(reviewMock)
    reviewRepository.getReviewById = jest.fn().mockResolvedValueOnce(reviewMock)

    const result = await reviewService.updateReview(1, 1, {
      review: "Review mock atualizada!",
    })

    expect(result).toEqual(reviewMock)
  })

  it("should throw ReviewNotFoundOrIsNotOwnerException when user is not the owner of the review and try to update", async () => {
    reviewRepository.isOwner = jest.fn().mockResolvedValueOnce(false)

    await expect(
      reviewService.updateReview(1, 1, { review: "Review mock atualizada!" }),
    ).rejects.toThrow(ReviewNotFoundOrIsNotOwnerException)
  })

  it("Should throw InternalServerErrorException when failed to update review", async () => {
    reviewRepository.isOwner = jest.fn().mockResolvedValueOnce(true)
    reviewRepository.updateReview = jest.fn().mockRejectedValueOnce(new Error())

    await expect(
      reviewService.updateReview(1, 1, { review: "Review mock atualizada!" }),
    ).rejects.toThrow(InternalServerErrorException)
  })

  it("Should delete a review", async () => {
    reviewRepository.isOwner = jest.fn().mockResolvedValueOnce(true)
    const result = await reviewService.deleteReview(1, 1)

    expect(result).toEqual({
      message: "Review with ID: 1 deleted successfully",
    })
  })

  it("should throw ReviewNotFoundOrIsNotOwnerException when user is not the owner of the review and try do delete", async () => {
    reviewRepository.isOwner = jest.fn().mockResolvedValueOnce(false)

    await expect(reviewService.deleteReview(1, 1)).rejects.toThrow(
      ReviewNotFoundOrIsNotOwnerException,
    )
  })

  it("Should throw InternalServerErrorException when failed to delete review", async () => {
    reviewRepository.isOwner = jest.fn().mockResolvedValueOnce(true)
    reviewRepository.deleteReview = jest.fn().mockRejectedValueOnce(new Error())

    await expect(reviewService.deleteReview(1, 1)).rejects.toThrow(
      InternalServerErrorException,
    )
  })
})
