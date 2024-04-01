import { Transform } from "class-transformer"
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator"

export class GetAllReviewsDto {
  @IsNumber()
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
  filter?: string = ""
}
