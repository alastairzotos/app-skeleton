import { Controller, Get, Request } from '@nestjs/common';
import { Principal } from 'decorators/principal.decorator';
import { PublicUser } from '@repo/models';

@Controller('test')
export class TestController {
  @Get()
  async test(@Principal() user: PublicUser) {
    console.log({ user });

    return 'hello';
  }
}
