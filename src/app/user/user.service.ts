import { Repository } from "typeorm"
import * as bcrypt from "bcrypt"

import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "./entities/user.entity"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { email },
    })

    return user
  }

  async createUser(): Promise<string> {
    if ((await this.userRepository.count()) > 0) {
      throw new BadRequestException("User already seeded")
    }
    const password = bcrypt.hashSync("1234", 10)
    const users = [{ name: "The Watcher", email: "watcher@mail.com", password }]
    await this.userRepository.save(users.map((user) => new User(user)))

    return "User seeded"
  }
}
