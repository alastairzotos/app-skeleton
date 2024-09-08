import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'features/auth/auth.guard';
import { Principal, UserData } from 'decorators/principal.decorator';
import { ac } from 'rbac';

@Controller('auth-test')
export class AuthTestController {
  @Get()
  @UseGuards(AuthGuard)
  async test(
    @Principal() user: UserData,
  ) {
    console.log(user);

    console.log(ac.can(user).read('collection', { ownerId: user.userId }));
    console.log(ac.can(user).read('collection', { ownerId: '123' }));
    console.log(ac.can(user).read('otherTable', { someData: 'foo' }));
    
    return 'hello';
  }
}
