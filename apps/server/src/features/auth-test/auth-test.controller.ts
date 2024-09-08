import { Controller, Get, UseGuards } from '@nestjs/common';
import { Principal } from 'decorators/principal.decorator';
import { PublicUser } from '@repo/models';
import { AuthGuard } from 'features/auth/auth.guard';
import { Session } from 'decorators/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('auth-test')
export class AuthTestController {
  @Get()
  @UseGuards(AuthGuard)
  async test(
    @Session() session: SessionContainer
  ) {
    console.log({
      sessionHandle: session.getHandle(),
      userId: session.getUserId(),
      accessTokenPayload: session.getAccessTokenPayload(),
    })

    return 'hello';
  }
}
