import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as Sentry from "@sentry/nestjs";
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: true,
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
    ],
  });

  app.use('/api/v1/billing/webhook', bodyParser.raw({ type: 'application/json' }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.set('trust proxy', 'loopback');

  app.enableCors();
  app.enableShutdownHooks();

  await app.listen(5001);
}

bootstrap();
