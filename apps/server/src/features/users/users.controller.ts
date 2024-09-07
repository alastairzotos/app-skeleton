import { Body, ConflictException, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { RegisterSchema } from '@repo/models';
import { Public } from 'decorators/public.decorator';
import { UsersService } from 'features/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Public()
  @Post('register')
  async register(@Body() { email, password }: RegisterSchema) {
    try {
      return await this.usersService.registerWithEmailAndPassword(email, password);
    } catch (e) {
      if (e.constraint_name === 'user_email_unique') {
        throw new ConflictException(`User with email '${email}' already exists`);
      }

      throw new InternalServerErrorException();
    }
  }
}
