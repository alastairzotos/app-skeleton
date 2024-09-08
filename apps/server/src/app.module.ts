import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from 'features/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthTestModule } from './features/auth-test/auth-test.module';
import { APP_PIPE } from '@nestjs/core';
import { HealthModule } from 'features/health/health.module';
import { DrizzleModule } from 'drizzle/provider';
import { ErrorHandlingMiddleware } from 'middleware/error-handling.middleware';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthMiddleware } from 'features/auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HealthModule,
    DrizzleModule,
    AuthModule,
    AuthTestModule,
  ],
  controllers: [],
  exports: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*');
  }
}
