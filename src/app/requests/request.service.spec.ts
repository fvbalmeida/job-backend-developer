import { TestingModule, Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { NotFoundException } from "@nestjs/common"

import {
  getMostViewedReviewsResponseMock,
  reviewRepositoryMock,
  routeRequestRepositoryMock,
  saveRequestDetailsMock,
} from "@/shared/__mocks__/review.mock"
import { RouteRequestService } from "./request.service"
import { RouteRequestRepository } from "./repositories/request.repository"
import { Review } from "../review/entities/review.entity"

describe("RouteRequestService Test", () => {
  let routeRequestService: RouteRequestService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        RouteRequestService,
        {
          provide: getRepositoryToken(RouteRequestRepository),
          useValue: routeRequestRepositoryMock.useValue,
        },
        {
          provide: getRepositoryToken(Review),
          useValue: reviewRepositoryMock.useValue,
        },
      ],
    }).compile()

    routeRequestService =
      moduleFixture.get<RouteRequestService>(RouteRequestService)
  })

  it("Should be defined", () => {
    expect(routeRequestService).toBeDefined()
  })

  it("Should return most viewed reviews", async () => {
    const mostViewed = await routeRequestService.getMostViewedReviews()
    expect(mostViewed).toEqual(getMostViewedReviewsResponseMock)
  })

  it("should throw NotFoundException when there is no review", async () => {
    routeRequestRepositoryMock.useValue.getMostViewedReviews = jest
      .fn()
      .mockResolvedValue([])

    await expect(routeRequestService.getMostViewedReviews()).rejects.toThrow(
      NotFoundException,
    )
  })

  it("Should save request details", async () => {
    const reviewId = 1
    const method = "GET"
    const path = "/movie-reviews"
    const saveRequestDetails = await routeRequestService.saveRequestDetails(
      method,
      path,
      reviewId,
    )

    expect(saveRequestDetails).toEqual(saveRequestDetailsMock)
  })
})
