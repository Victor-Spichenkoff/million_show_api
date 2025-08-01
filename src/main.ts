import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'node:process'
import { configureSwagger } from '../config/swaggerConfig'
import { PipeValidationConfig } from 'config/validationConfig'
import { ValidationPipe } from '@nestjs/common'
import { CustomBadRequestFilter } from 'global/error400Filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT ?? 3000
  configureSwagger(app)

  // to use short error message:
  // app.useGlobalFilters(new ShortErrorFilter())
  app.useGlobalFilters(new CustomBadRequestFilter())
  app.useGlobalPipes(new ValidationPipe(PipeValidationConfig))

  app.enableCors({
    origin: process.env.NODE_ENV === 'development' ? '*' : [
        "https://million-show.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization'],
  })

  await app.listen(port)
  console.log("Rodando em: http://localhost:" + port + "/swagger")
}

bootstrap()
