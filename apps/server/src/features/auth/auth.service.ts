import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'features/users/users.service';
import { PublicUser } from '@repo/models';
import { CryptoService } from 'features/crypto/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
  ) { }

  async login(user: PublicUser) {
    const payload = { email: user.email, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<PublicUser | null> {
    const user = await this.usersService.getByEmailWithPassword(username);

    if (user && await this.cryptoService.comparePasswords(password, user.hashedPassword)) {
      const { hashedPassword, ...result } = user;
      return result;
    }

    return null;
  }

  async validateOAuthLogin(email: string) {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      // register
    }

    return user;
  }
}
