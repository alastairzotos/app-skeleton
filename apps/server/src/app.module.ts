import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from 'features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './features/test/test.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from 'features/auth/guards/jwt-auth.guard';
import { HealthModule } from 'features/health/health.module';
import { DrizzleModule } from 'drizzle/provider';
import { ErrorHandlingMiddleware } from 'middleware/error-handling.middleware';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HealthModule,
    DrizzleModule,
    AuthModule,
    UsersModule,
    TestModule,
  ],
  controllers: [],
  exports: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*');
  }
}
