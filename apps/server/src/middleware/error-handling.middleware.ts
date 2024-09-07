import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlingMiddleware implements NestMiddleware {
  private logger = new Logger('ErrorHandler');

  use(req: Request, res: Response, next: NextFunction) {
    try {
      next();
    } catch (error) {
      this.logger.error('Unexpected error:', error);

      res.status(500).json({
        statusCode: 500,
        message: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        path: req.url,
      });
    }
  }
}
