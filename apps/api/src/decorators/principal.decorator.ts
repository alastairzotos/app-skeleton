import { createParamDecorator } from '@nestjs/common';

export const Principal = createParamDecorator((data: string, ctx) => ctx.getArgs()?.[0]?.principal);
