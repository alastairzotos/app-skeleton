import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Database, InjectDb } from 'drizzle/provider';
import { Request } from 'express';
import { BaseRepository } from 'utils/data-access/base.repository';
import { addUserToRequest } from './auth.utils';

@Injectable()
export class AdminGuard extends BaseRepository implements CanActivate {
  constructor(
    @InjectDb() db: Database,
  ) {
    super(db);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const user = await addUserToRequest(request);

    if (!user) {
      return false;
    }

    const profile = await this.db().query.profileTable.findFirst({
      where: (t, { eq }) => eq(t.id, user.id),
    });

    if (!profile) {
      return false;
    }

    return profile.role === 'admin';
  }
}
