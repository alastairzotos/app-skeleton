import { Module } from '@nestjs/common';
import { AuthTestController } from 'features/auth-test/auth-test.controller';
import { AuthModule } from 'features/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthTestController]
})
export class AuthTestModule {}
