import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm"

import { Movie } from "@/app/movie/entities/movie.entity"
import { User } from "@/app/user/entities/user.entity"
import { RouteRequest } from "@/app/requests/entities/request.entity"

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 255 })
  review: string

  @Column()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @Column()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  @ManyToOne(() => Movie, (movie) => movie.reviews, { onDelete: "CASCADE" })
  movie: Movie

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
  user: User

  @OneToMany(() => RouteRequest, (request) => request.review)
  requests: RouteRequest[]

  constructor(review: Partial<Review>) {
    Object.assign(this, review)
  }
}
