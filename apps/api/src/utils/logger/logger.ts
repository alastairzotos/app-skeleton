import { Inject } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

interface RequestInfo {
  requestId?: string;
  request: Request;
}

export const asyncRequestStorage = new AsyncLocalStorage<RequestInfo>();

const addCustomFormat = winston.format((info) => {
  const reqInfo = asyncRequestStorage.getStore();

  if (reqInfo && reqInfo.requestId) {
    info.requestId = reqInfo.requestId;
  }

  if (reqInfo && (reqInfo.request as any).principal) {
    info.userId = (reqInfo.request as any).principal?.id;
  }

  return info;
});

export const createWinstonConfig = (nodeEnv: string, betterStackToken: string): WinstonModuleOptions => {
  if (nodeEnv === 'development') {
    return {
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            addCustomFormat(),
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.simple()
          ),
        }),
      ],
    };
  }

  return {
    transports: [
      new winston.transports.Http({
        level: 'info',
        host: 's1321461.eu-nbg-2.betterstackdata.com',
        path: '/',
        ssl: true,
        headers: {
          Authorization: `Bearer ${betterStackToken}`,
          'Content-Type': 'application/json',
        },
        format: winston.format.combine(
          addCustomFormat(),
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
    ],
  }
};

export const InjectWinston = () => Inject(WINSTON_MODULE_PROVIDER);
