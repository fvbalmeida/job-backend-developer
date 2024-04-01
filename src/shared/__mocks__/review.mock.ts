import { SearchByTitleResponse } from "src/shared/types/omdb.types"

import { getRepositoryToken } from "@nestjs/typeorm"

import { Movie } from "../../app/movie/entities/movie.entity"
import { OmdbService } from "../../app/omdb/omdb.service"
import { CreateReviewDto } from "../../app/review/dto/create-review.dto"
import { GetAllReviewsDto } from "../../app/review/dto/get-all-reviews.dto"
import { Review } from "../../app/review/entities/review.entity"
import { ReviewRepository } from "../../app/review/repositories/review.repository"
import { ReviewService } from "../../app/review/review.service"
import { User } from "../../app/user/entities/user.entity"
import { DeleteReviewResponse, RequestWithUser } from "../types/review.types"
import { RouteRequestService } from "@/app/requests/request.service"
import { UpdateReviewDto } from "@/app/review/dto/update-review.dto"
import { RouteRequestRepository } from "@/app/requests/repositories/request.repository"
import { UserService } from "@/app/user/user.service"
import { AuthService } from "@/app/auth/auth.service"

export const userMock: Omit<User, "hashPassword"> = {
  id: 1,
  email: "mock@mail.com",
  password: "123456",
  name: "Mock User",
  createdAt: new Date(),
  reviews: [],
}

export const reqMock: Partial<RequestWithUser> = {
  user: {
    id: 1,
    email: "mock@mail.com",
  },
}

export const movieMock: Movie = new Movie({
  id: 1,
  title: "Mock Movie",
  imdbID: "tt12345",
  createdAt: new Date(),
  actors: "Mock Actor",
  director: "Mock Director",
  imdbRating: "5",
  released: new Date(),
})

export const reviewMock: Review = new Review({
  id: 1,
  review: "Excelente mock de review!",
  createdAt: new Date(),
  updatedAt: new Date(),
  movie: movieMock,
  user: userMock,
})

export const createReviewDtoMock: CreateReviewDto = {
  title: "Filme Mock",
  imdbID: "tt12345",
  review: "Excelente mock de review!",
}

export const getAllReviewsDtoMock: GetAllReviewsDto = {
  page: 1,
}

export const updateReviewDtoMock: UpdateReviewDto = {
  review: "Review mock atualizada!",
}

export const deleteReviewResponseMock: DeleteReviewResponse = {
  message: "Review with ID: 1 deleted successfully",
}

export const titleSearchResponse: SearchByTitleResponse[] = [
  {
    Title: "Filme Mock",
    Year: "2021",
    imdbID: "tt12345",
    Type: "movie",
    Poster: "N/A",
  },
]

export const imdbIDSearchResponse = {
  Title: "Filme Mock",
  Year: "2021",
  Rated: "5.0",
  Released: "N/A",
  Runtime: "N/A",
  Genre: "N/A",
  Director: "N/A",
  Writer: "N/A",
  Actors: "N/A",
  Plot: "N/A",
  Language: "N/A",
  Country: "N/A",
  Awards: "N/A",
  Poster: "N/A",
  Ratings: [{ Source: "N/A", Value: "N/A" }],
  Metascore: "N/A",
  imdbRating: "N/A",
  imdbVotes: "N/A",
  imdbID: "tt12345",
  Type: "movie",
  DVD: "N/A",
  BoxOffice: "N/A",
  Production: "N/A",
  Website: "N/A",
  Response: "True",
}

export const axiosParamsMock = {
  endpoint: "https://www.omdbapi.com",
  params: {
    apikey: "21d9fecf",
    s: "Filme Mock",
    type: "movie",
  },
}

export const getMostViewedReviewsResponseMock = [
  {
    id: 1,
    movie_title: "Filme Mock",
    views: 14,
  },
]

export const saveRequestDetailsMock = {
  method: "GET",
  path: "/movie-reviews",
  reviewId: 1,
}

export const reviewServiceMock = {
  provide: ReviewService,
  useValue: {
    createReview: jest.fn().mockResolvedValue(reviewMock),
    getAllReviews: jest.fn().mockResolvedValue([reviewMock]),
    getReviewById: jest.fn().mockResolvedValue(reviewMock),
    updateReview: jest.fn().mockResolvedValue(reviewMock),
    deleteReview: jest.fn().mockResolvedValue(deleteReviewResponseMock),
  },
}

export const reviewRepositoryMock = {
  provide: getRepositoryToken(ReviewRepository),
  useValue: {
    create: jest.fn().mockResolvedValue(reviewMock),
    createReview: jest.fn().mockResolvedValue(reviewMock),
    userHasReviewedMovie: jest.fn().mockResolvedValue(reviewMock),
    getAllReviews: jest.fn().mockResolvedValue([reviewMock]),
    getReviewById: jest.fn().mockResolvedValue(reviewMock),
    updateReview: jest.fn().mockResolvedValue(reviewMock),
    deleteReview: jest.fn().mockResolvedValue(deleteReviewResponseMock),
    isOwner: jest.fn().mockResolvedValue(true),
    findOne: jest.fn().mockResolvedValue(reviewMock),
  },
}

export const omdbServiceMock = {
  provide: OmdbService,
  useValue: {
    searchMoviesByTitle: jest.fn().mockResolvedValue([titleSearchResponse]),
    getMovieByImdbID: jest.fn().mockResolvedValue(movieMock),
    fetchDatafromOmdb: jest.fn(),
  },
}

export const userRepositoryMock = {
  provide: getRepositoryToken(User),
  useValue: {
    findUserByEmail: jest.fn().mockResolvedValue(userMock),
    count: jest.fn().mockResolvedValue(0),
    save: jest.fn().mockResolvedValue("User seeded"),
    findOneOrFail: jest.fn().mockResolvedValue(userMock),
  },
}

export const routeRequestServiceMock = {
  provide: RouteRequestService,
  useValue: {
    getMostViewedReviews: jest
      .fn()
      .mockResolvedValue(getMostViewedReviewsResponseMock),
    saveRequestDetails: jest.fn().mockResolvedValue(saveRequestDetailsMock),
  },
}

export const routeRequestRepositoryMock = {
  provide: getRepositoryToken(RouteRequestRepository),
  useValue: {
    getMostViewedReviews: jest
      .fn()
      .mockResolvedValue(getMostViewedReviewsResponseMock),
    save: jest.fn().mockResolvedValue(saveRequestDetailsMock),
  },
}

export const userServiceMock = {
  provide: UserService,
  useValue: {
    createUser: jest.fn().mockResolvedValue("User seeded"),
    findUserByEmail: jest.fn().mockResolvedValue(userMock),
  },
}

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    login: jest.fn().mockResolvedValue({ access_token: "mockToken" }),
  },
}
