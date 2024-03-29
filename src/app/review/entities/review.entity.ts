import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

import { Movie } from "@/app/movie/entities/movie.entity"
import { User } from "@/app/user/entities/user.entity"

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

  constructor(review: Partial<Review>) {
    Object.assign(this, review)
  }
}
