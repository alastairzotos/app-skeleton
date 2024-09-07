import { Controller, Post, UseGuards } from '@nestjs/common';
import { Principal } from 'decorators/principal.decorator';
import { Public } from 'decorators/public.decorator';
import { AuthService } from 'features/auth/auth.service';
import { LocalAuthGuard } from 'features/auth/guards/local-auth.guard';
import { PublicUser } from '@repo/models';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Principal() user: PublicUser) {
    return await this.authService.login(user);
  }
}
