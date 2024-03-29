import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator"

import { ApiProperty } from "@nestjs/swagger"

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^tt/, { message: 'imdbID must contain "tt"' })
  imdbID?: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  review: string
}
