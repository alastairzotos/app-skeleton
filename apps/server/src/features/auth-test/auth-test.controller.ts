import { Controller, Get, UseGuards } from '@nestjs/common';
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
