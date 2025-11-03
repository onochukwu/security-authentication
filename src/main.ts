import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('OLERA API')
    .setDescription('API documentation and endpoint testing for Security authentication system')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('OLERA')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`OLERA running on http://localhost:${port}`);
  console.log(`Swagger available at http://localhost:${port}/api`);
}
bootstrap();
