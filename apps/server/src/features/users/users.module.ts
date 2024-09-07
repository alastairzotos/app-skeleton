import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from 'features/users/users.repository';
import { DrizzleModule } from 'drizzle/provider';
import { CryptoModule } from 'features/crypto/crypto.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    DrizzleModule,
    CryptoModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
