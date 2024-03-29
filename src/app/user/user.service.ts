import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { email: email },
    });

    return user;
  }
}
