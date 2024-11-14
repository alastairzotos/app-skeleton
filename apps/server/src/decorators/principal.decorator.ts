import { createParamDecorator } from '@nestjs/common';

export const Principal = createParamDecorator((data: string, { args }) => args[0].principal);
