import { Test, TestingModule } from "@nestjs/testing"

import {
  routeRequestServiceMock,
  reviewServiceMock,
  createReviewDtoMock,
  reqMock,
  reviewMock,
  getAllReviewsDtoMock,
  updateReviewDtoMock,
} from "@/shared/__mocks__/review.mock"
import { ReviewController } from "./review.controller"
import { RouteRequestService } from "../requests/request.service"
import { RequestWithUser } from "@/shared/types/review.types"

describe("ReviewController", () => {
  let reviewController: ReviewController

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        reviewServiceMock,
        RouteRequestService,
        {
          provide: RouteRequestService,
          useValue: routeRequestServiceMock.useValue,
        },
      ],
    }).compile()

    reviewController = moduleFixture.get<ReviewController>(ReviewController)
  })

  it("Should be defined", () => {
    expect(reviewController).toBeDefined()
  })

  it("Should create a new review", async () => {
    const result = await reviewController.createReview(
      reqMock as RequestWithUser,
      createReviewDtoMock,
    )

    expect(result).toEqual(reviewMock)
  })

  it("Should get all reviews", async () => {
    const result = await reviewController.getAllReviews(getAllReviewsDtoMock)
    expect(result[0].id).toEqual(reviewMock.id)
  })

  it("Should get a review by its id", async () => {
    const result = await reviewController.getReviewById(reviewMock.id)
    expect(result.id).toEqual(reviewMock.id)
  })

  it("Should update a review", async () => {
    const result = await reviewController.updateReview(
      reqMock as RequestWithUser,
      reviewMock.id,
      updateReviewDtoMock,
    )
    expect(result).toEqual(reviewMock)
  })

  it("Should delete a review", async () => {
    const result = await reviewController.deleteReview(
      reqMock as RequestWithUser,
      reviewMock.id,
    )
    expect(result).toEqual({
      message: `Review with ID: ${reviewMock.id} deleted successfully`,
    })
  })
})
