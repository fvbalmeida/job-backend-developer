import { Request } from "express"

import { Movie } from "@/app/movie/entities/movie.entity"
import { Review } from "@/app/review/entities/review.entity"

export type UserJwtData = {
  id: number
  email: string
}

export type RequestWithUser = Request & {
  user: UserJwtData
}

export type CreateReviewResponse =
  | Review
  | {
      message: string
      movies: Partial<Movie>[]
    }

export type DeleteReviewResponse = {
  message: string
}
