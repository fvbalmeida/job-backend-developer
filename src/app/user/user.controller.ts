import { Controller, Get } from "@nestjs/common"

import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("seed")
  async seedUsers() {
    await this.userService.createUser()
    return "Users seeded"
  }
}
