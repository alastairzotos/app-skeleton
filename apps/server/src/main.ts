import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'features/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
    ],
  });

  app.enableCors({
    origin: app.get(ConfigService).get('CLIENT_URL'),
    credentials: true,
  });

  app.get(AuthService).persona.setupExpress(app.getHttpAdapter().getInstance());

  await app.listen(3001);
}

bootstrap();
