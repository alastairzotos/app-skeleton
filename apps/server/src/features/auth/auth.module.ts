import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'features/users/users.module';
import { LocalStrategy } from './strategies/local-strategy/local-strategy.service';
import { JwtStrategy } from './strategies/jwt-strategy/jwt-strategy.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CryptoModule } from 'features/crypto/crypto.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    CryptoModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
