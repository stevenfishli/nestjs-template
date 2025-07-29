import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import * as yaml from 'js-yaml';

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    // include: [UserIdentityModule, ...] // if need to include module
  });
  writeFileSync(
    resolve(__dirname, '../../openapi.yaml'),
    yaml.dump(document),
    'utf8'
  );
  await app.close();
  console.log('✅ openapi.yaml generated');
}

generateOpenApi();
