import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"

import { Review } from "@/app/review/entities/review.entity"

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 100, nullable: false })
  title: string

  @Column({ type: "date", nullable: true })
  released: Date

  @Column({ type: "varchar", length: 5, nullable: true })
  imdbRating: string

  @Column({ type: "varchar", length: 15, nullable: false, unique: true })
  imdbID: string

  @Column({ type: "varchar", length: 255, nullable: true })
  actors: string

  @Column({ type: "varchar", length: 100, nullable: true })
  director: string

  @Column({})
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[]

  constructor(movie: Partial<Movie>) {
    Object.assign(this, movie)
  }
}
