import { IsString } from "class-validator"

import { PartialType } from "@nestjs/mapped-types"
import { ApiProperty } from "@nestjs/swagger"

import { CreateReviewDto } from "./create-review.dto"

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiProperty()
  @IsString()
  review: string
}
