import { Controller, Get } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { RouteRequestService } from "./request.service"

@ApiTags("Ranking")
@Controller("requests")
export class RouteRequestController {
  constructor(private readonly routeRequestService: RouteRequestService) {}

  @ApiOperation({
    summary: "Get most viewed reviews",
    description: "Get the most viewed reviews from the database",
  })
  @Get("most-viewed-reviews")
  async getMostViewedReviews() {
    return this.routeRequestService.getMostViewedReviews()
  }
}
