import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Review } from "../review/entities/review.entity"
import { RouteRequest } from "./entities/request.entity"
import { RouteRequestService } from "./request.service"
import { RouteRequestController } from "./request.controller"

@Module({
  imports: [TypeOrmModule.forFeature([RouteRequest, Review])],
  providers: [RouteRequestService],
  controllers: [RouteRequestController],
  exports: [RouteRequestService],
})
export class RouteRequestModule {}
