import { config } from 'dotenv';
import { resolve } from 'path';
// Use process.cwd() to resolve paths from the directory where the command is run
// This is more reliable than __dirname when running from dist/
const rootEnv = resolve(process.cwd(), '.env');
const apiEnv = resolve(process.cwd(), 'apps/api/.env');

console.log(`[Env] Attempting to load root .env: ${rootEnv}`);
config({ path: rootEnv });

console.log(`[Env] Attempting to load api .env: ${apiEnv}`);
config({ path: apiEnv });

if (process.env.GOOGLE_CLIENT_ID) {
  const truncatedId = process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...';
  console.log(`[Env] Detected GOOGLE_CLIENT_ID starting with: ${truncatedId}`);
  if (process.env.GOOGLE_CLIENT_ID.includes('placeholder')) {
    console.warn('[Warning] GOOGLE_CLIENT_ID is still a placeholder!');
  }
} else {
  console.warn('[Warning] GOOGLE_CLIENT_ID is MISSING in process.env!');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('AtSpaces API')
    .setDescription('The AtSpaces Booking & Vendor API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  // Enable CORS so the React frontend can communicate with the API
  app.enableCors({
    origin: '*', // For development, allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
