import { Module } from '@nestjs/common';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SupertokensProvider } from './config.provider';
import { SupertokensService } from './supertokens.service';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [ConfigModule],
  providers: [SupertokensProvider, SupertokensService],
  exports: [SupertokensProvider, SupertokensService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
