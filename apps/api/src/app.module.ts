import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueConfig, queues } from '@repo/common';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { DrizzleModule } from 'drizzle/provider';
import { ErrorHandlingMiddleware } from 'middleware/error-handling.middleware';
import { RequestContextMiddleware } from 'middleware/request-context.middleware';
import { AuthModule } from 'modules/auth/auth.module';
import { BillingModule } from 'modules/billing/billing.module';
import { EmailModule } from 'modules/email/email.module';
import { HealthModule } from 'modules/health/health.module';
import { ProfilesModule } from 'modules/profiles/profiles.module';
import { WinstonModule } from 'nest-winston';
import { ZodValidationPipe } from 'nestjs-zod';
import { createWinstonConfig } from 'utils/logger/logger';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return createWinstonConfig(configService.get('NODE_ENV'), configService.get('BETTERSTACK_TOKEN'));
      }
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          connection: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
            username: config.get('REDIS_USER'),
            password: config.get('REDIS_PASSWORD'),
          },
          defaultJobOptions: {
            attempts: Number.MAX_SAFE_INTEGER,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          }
        }
      },
    }),
    BullModule.registerQueue(
      ...Object.entries(queues as Record<string, QueueConfig>)
        .map(([name, { options }]) => ({ name, ...options })),
    ),
    HealthModule,
    DrizzleModule,
    AuthModule,
    ProfilesModule,
    BillingModule,
    EmailModule,
    PostsModule,
  ],
  controllers: [],
  exports: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*');
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
