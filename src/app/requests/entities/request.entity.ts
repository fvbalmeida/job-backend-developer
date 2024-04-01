import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm"

import { Review } from "../../review/entities/review.entity"

@Entity("route_request")
export class RouteRequest {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  method: string

  @Column()
  path: string

  @Column()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @ManyToOne(() => Review, (review) => review.requests, { onDelete: "CASCADE" })
  review: Review

  constructor(routeRequest: Partial<RouteRequest>) {
    Object.assign(this, routeRequest)
  }
}
