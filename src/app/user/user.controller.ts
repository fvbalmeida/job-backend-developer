import { Controller, Get } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { UserService } from "./user.service"
@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: "Seed users",
    description: "Seed user in the database",
  })
  @Get("seed")
  async seedUsers() {
    await this.userService.createUser()
    return "Users seeded"
  }
}
