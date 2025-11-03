import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as Sentry from "@sentry/nestjs";
import { Request } from 'express';
import { getSupabase } from 'modules/auth/supabase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    (request as any).principal = user;

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
