import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.DOTENV_CONFIG_PATH || '.env',
  override: true,
});

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthGuard } from './utils/authentication/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { execSync } from 'child_process';
import config from './config';

function runPrismaMigrations() {
  execSync('nx run backend:prisma-deploy', { stdio: 'inherit' });
  execSync('nx run backend:prisma-seed', { stdio: 'inherit' });
}

runPrismaMigrations();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //If set to true validator will strip validated object of any properties that do not have any decorators.
      transform: true, //The ValidationPipe can automatically transform payloads to be objects typed according to their DTO classes. To enable auto-transformation, set transform to true.
      forbidNonWhitelisted: true, //If set to true, instead of stripping non-whitelisted properties validator will throw an error
      transformOptions: {
        enableImplicitConversion: true, //If set to true class-transformer will attempt conversion based on TS reflected type
      },
    })
  );

  // global AuthGuard
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));

  setupSwagger(app);

  const port = config.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

function setupSwagger(app: INestApplication) {
  const builder = new DocumentBuilder();
  const config = builder
    .setTitle('TodoList')
    .setDescription('This is a basic Swagger document.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

bootstrap();
