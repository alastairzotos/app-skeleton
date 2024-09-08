import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import UserMetadata from "supertokens-node/recipe/usermetadata";

export type UserData = {
  userId: string;
  role: 'user' | 'admin';
  preferences: {
    theme: 'light' | 'dark';
  }
}

export const Principal = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const session = request.session as SessionContainer;

    const userId = session.getUserId();

    const { metadata } = await UserMetadata.getUserMetadata(userId);

    return {
      userId,
      role: metadata.role,
      preferences: metadata.preferences,
    } as UserData;
  },
);
