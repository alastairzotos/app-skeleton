import { Controller, Get, Post, Response, UseGuards } from '@nestjs/common';
import { Response as Res } from 'express';
import { Principal } from 'decorators/principal.decorator';
import { Public } from 'decorators/public.decorator';
import { AuthService } from 'features/auth/auth.service';
import { LocalAuthGuard } from 'features/auth/guards/local-auth.guard';
import { PublicUser } from '@repo/models';
import { GoogleOAuthGuard } from 'features/auth/guards/google-oauth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Principal() user: PublicUser) {
    return await this.authService.login(user);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() { }

  @Public()
  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @Principal() user: PublicUser,
    @Response() res: Res
  ) {
    const { access_token } = await this.authService.login(user);

    res.redirect(`${this.configService.get('APP_URL')}/oauth-success?at=${access_token}`)
  }
}
