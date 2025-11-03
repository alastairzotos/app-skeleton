// src/middleware/request-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { asyncRequestStorage } from 'utils/logger/logger';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();

    asyncRequestStorage.run({ request: req, requestId }, () => {
      req.headers['x-request-id'] = requestId;
      next();
    });
  }
}
