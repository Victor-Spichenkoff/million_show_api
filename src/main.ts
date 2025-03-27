import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'node:process';
import { configureSwagger } from '../config/swaggerConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT ?? 3000
  configureSwagger(app)

  await app.listen(port)
  console.log("Rodando em: http://localhost:" + port+"/swagger")
}

bootstrap()
