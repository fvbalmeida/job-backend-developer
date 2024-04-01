import { TestingModule, Test } from "@nestjs/testing"

import {
  getMostViewedReviewsResponseMock,
  routeRequestServiceMock,
} from "@/shared/__mocks__/review.mock"
import { RouteRequestService } from "./request.service"
import { RouteRequestController } from "./request.controller"

describe("RouteRequestController Test", () => {
  let routeRequestController: RouteRequestController

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RouteRequestController],
      providers: [
        {
          provide: RouteRequestService,
          useValue: routeRequestServiceMock.useValue,
        },
      ],
    }).compile()

    routeRequestController = moduleFixture.get<RouteRequestController>(
      RouteRequestController,
    )
  })

  it("Should be defined", () => {
    expect(routeRequestController).toBeDefined()
  })

  it("Should get most viewed reviews", async () => {
    const result = await routeRequestController.getMostViewedReviews()

    expect(result).toEqual(getMostViewedReviewsResponseMock)
  })
})
