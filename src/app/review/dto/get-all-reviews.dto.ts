import { Transform } from "class-transformer"
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator"

export class GetAllReviewsDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number = 1

  @Transform(({ value }) => `movie.${value}`)
  @IsOptional()
  @IsIn(["movie.released", "movie.imdbRating"])
  sort?: "released" | "imdbRating"

  @IsOptional()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC" = "DESC"

  @IsOptional()
  @IsString()
  @IsIn(["", "title", "actors", "director"])
  filter?: string = ""
}
