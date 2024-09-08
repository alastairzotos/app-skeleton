import { Injectable } from '@nestjs/common';
import { User } from 'drizzle/schemas';
import { CryptoService } from 'features/crypto/crypto.service';
import { UsersRepository } from 'features/users/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly usersRepo: UsersRepository,
  ) {}

  async registerWithEmailAndPassword(email: string, password: string) {
    const hashedPassword = await this.cryptoService.hashPassword(password);

    return await this.usersRepo.registerWithEmailAndPassword(email, hashedPassword);
  }

  async getByEmail(email: string) {
    return await this.usersRepo.getByEmail(email);
  }

  async getByEmailWithPassword(email: string) {
    return await this.usersRepo.getByEmailWithPassword(email);
  }
}
