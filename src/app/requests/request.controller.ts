import { Controller, Get } from "@nestjs/common"

import { RouteRequestService } from "./request.service"

@Controller("requests")
export class RouteRequestController {
  constructor(private readonly routeRequestService: RouteRequestService) {}

  @Get("most-viewed-reviews")
  async getMostViewedReviews() {
    return this.routeRequestService.getMostViewedReviews()
  }
}
