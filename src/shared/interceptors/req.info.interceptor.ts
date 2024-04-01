/* eslint-disable */

import { Observable } from "rxjs"
import { tap } from "rxjs/operators"

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"

import { RouteRequestService } from "@/app/requests/request.service"

@Injectable()
export class RequestDetailsInterceptor implements NestInterceptor {
  constructor(private readonly routeRequestService: RouteRequestService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, path: url } = request

    const isGetMovieReviewById =
      method === "GET" && /^\/movie-reviews\/\d+$/.test(url)

    if (isGetMovieReviewById) {
      const reviewId = url.split("/")[2]

      return next.handle().pipe(
        tap((res) => {
          const response = context.switchToHttp().getResponse()
          if (response.statusCode === 200) {
            this.routeRequestService.saveRequestDetails(method, url, reviewId)
          }
        }),
      )
    } else {
      return next.handle()
    }
  }
}
