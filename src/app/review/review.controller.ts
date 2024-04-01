import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger"

import { GetAllReviewsDto } from "./dto/get-all-reviews.dto"
import { ReviewService } from "./review.service"
import { CreateReviewDto } from "./dto/create-review.dto"
import { RequestWithUser } from "@/shared/types/review.types"
import { UpdateReviewDto } from "./dto/update-review.dto"
import { RequestDetailsInterceptor } from "@/shared/interceptors/req.info.interceptor"

@ApiTags("Movie Reviews")
@Controller("movie-reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({
    summary: "Create a movie review",
    description: "Create a new movie review in database",
  })
  @ApiBearerAuth("AUTH_KEY")
  @UseGuards(AuthGuard("jwt"))
  @Post()
  async createReview(
    @Request() req: RequestWithUser,
    @Body(ValidationPipe) createReviewDto: CreateReviewDto,
  ) {
    const { user } = req
    return await this.reviewService.createReview(user.id, createReviewDto)
  }

  @ApiOperation({
    summary: "Get all movie reviews",
    description: "Get all movie reviews from database",
  })
  @ApiQuery({ name: "page", required: true, type: Number })
  @ApiQuery({ name: "limit", required: true, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "filter", required: false, type: String })
  @Get()
  async getAllReviews(
    @Query(new ValidationPipe({ transform: true }))
    getAllReviewsDto: GetAllReviewsDto,
  ) {
    return await this.reviewService.getAllReviews(getAllReviewsDto)
  }

  @ApiOperation({
    summary: "Get a movie review by ID",
    description: "Get a movie review by its ID",
  })
  @UseInterceptors(RequestDetailsInterceptor)
  @Get(":id")
  async getReviewById(@Param("id", ParseIntPipe) reviewId: number) {
    return await this.reviewService.getReviewById(reviewId)
  }

  @ApiOperation({
    summary: "Update a movie review",
    description: "Update a movie review by its ID",
  })
  @ApiBearerAuth("AUTH_KEY")
  @UseGuards(AuthGuard("jwt"))
  @Patch(":id")
  async updateReview(
    @Request() req: RequestWithUser,
    @Param("id", ParseIntPipe) reviewId: number,
    @Body(ValidationPipe) updateReviewDto: UpdateReviewDto,
  ) {
    const { user } = req
    return await this.reviewService.updateReview(
      user.id,
      reviewId,
      updateReviewDto,
    )
  }

  @ApiOperation({
    summary: "Delete a movie review",
    description: "Delete a movie review by its ID",
  })
  @ApiBearerAuth("AUTH_KEY")
  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async deleteReview(
    @Request() req: RequestWithUser,
    @Param("id", ParseIntPipe) reviewId: number,
  ) {
    const { user } = req
    return await this.reviewService.deleteReview(user.id, reviewId)
  }
}
