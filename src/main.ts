import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { SentryExceptionFilter } from './sentry-exception.filter';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN ,
    tracesSampleRate: 1.0,
    sendDefaultPii: true,
    enableLogs: true,
  });
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new SentryExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Jobs API')
    .setDescription('API to get job listings with filtering and pagination')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
