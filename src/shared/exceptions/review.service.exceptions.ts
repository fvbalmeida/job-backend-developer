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
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: "The movie title provided does not match the imdbID provided. ",
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}