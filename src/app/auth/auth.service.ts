import { compareSync } from "bcrypt"

import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import { User } from "../user/entities/user.entity"
import { UserService } from "../user/user.service"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async validateUser(email: string, password: string) {
    let user: User
    try {
      user = await this.userService.findUserByEmail(email)
    } catch (error) {
      return null
    }

    const isPasswordValid = compareSync(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    return user
  }
}
