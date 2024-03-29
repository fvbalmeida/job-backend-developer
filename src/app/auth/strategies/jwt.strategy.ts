import { ExtractJwt, Strategy } from "passport-jwt"

import { PassportStrategy } from "@nestjs/passport"

import { AuthService } from "../auth.service"

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    })
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email }
  }
}
