/* eslint-disable */
import { loadConfig } from "./shared/utils/config"
loadConfig()

import { NestFactory } from "@nestjs/core"

import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as swaggerStats from "swagger-stats"

if (!process.env.IS_TS_NODE) {
  require("module-alias/register")
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle("NestJS API")
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      }, 'AUTH_KEY'
    )
    .setDescription("Rotas da API")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  app.use(swaggerStats.getMiddleware({ swaggerSpec: document }))
  
  SwaggerModule.setup('docs', app, document)

  await app.listen(3000)
}
bootstrap()
