import { Module } from '@nestjs/common';
import { AuthTestController } from 'features/auth-test/auth-test.controller';
import { AuthModule } from 'features/auth/auth.module';
import { AuthTestRepository } from './auth-test.repository';
import { DrizzleModule } from 'drizzle/provider';

@Module({
  imports: [DrizzleModule, AuthModule],
  controllers: [AuthTestController],
  providers: [AuthTestRepository],
  exports: [AuthTestRepository],
})
export class AuthTestModule {}
