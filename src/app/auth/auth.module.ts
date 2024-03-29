import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"

import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UserModule } from "../user/user.module"
import { LocalStrategy } from "./strategies/local.strategy"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PassportModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
