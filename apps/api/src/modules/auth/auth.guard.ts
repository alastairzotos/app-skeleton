import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as Sentry from "@sentry/nestjs";
import { Request } from 'express';
import { addUserToRequest } from './auth.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const user = await addUserToRequest(request);

    if (process.env.NODE_ENV === 'production') {
      if (user) {
        Sentry.setUser({
          id: user.id,
          email: user.email,
        });
      } else {
        Sentry.setUser(null);
      }
    }

    return true
  }
}
