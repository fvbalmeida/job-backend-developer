import { Controller, Post, Req, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger"

import { AuthService } from "./auth.service"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: "Login",
    description: "Login with email and password",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          example: "review@example.com",
        },
        password: {
          type: "string",
          example: "reviewPassword",
        },
      },
      required: ["email", "password"],
    },
  })
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Req() req: any) {
    return this.authService.login(req.user)
  }
}
