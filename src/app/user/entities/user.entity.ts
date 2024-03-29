import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from '../../review/entities/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
