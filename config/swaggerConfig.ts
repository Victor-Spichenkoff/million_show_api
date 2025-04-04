import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

// colocar essa na main e receber o app
export const configureSwagger = (app: INestApplication<any>) => {
  const documentFactory = () => SwaggerModule.createDocument(app, config)

  // endpoint dele == swagger
  SwaggerModule.setup('swagger', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })
}
