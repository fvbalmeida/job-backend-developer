import { HttpException, HttpStatus } from "@nestjs/common"

import { SearchByTitleResponse } from "../types/omdb.types"

export class MultipleMoviesFoundException extends HttpException {
  constructor(movies: SearchByTitleResponse[]) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error:
          "Multiple movies with similar titles. Please select the desired movie, copy the exact title and include in your request body! If your movie is not listed, please try a different search term or the correct complete title.",
        movies,
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}

export class SimilarVideosFoundException extends HttpException {
  constructor(movies: SearchByTitleResponse[]) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error:
          "No movies found with the title provided. Did you mean one of these?",
        movies,
      },
      HttpStatus.NOT_FOUND,
    )
  }
}

export class TitleNotMatchImdbIDException extends HttpException {
  constructor(movieTitle: string, imdbID: string) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `The movie title provided does not match the imdbID provided. Please provide the correct title.`,
        movieTitle,
        imdbID,
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}

export class ReviewNotFoundOrIsNotOwnerException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: "Review not found or you are not the owner of this review.",
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}

export class checkIfReviewAlreadyExistsException extends HttpException {
  constructor(reviewId: number) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `Review already exists for this movie. If you want to modify it, review ID is: ${reviewId}`,
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}
