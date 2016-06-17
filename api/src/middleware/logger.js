'use strict';
import winston from 'winston';
import logger from 'koa-logger';
import path from 'path';

const developmentLogger = logger();
export const winstonInstance = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    }),
  ]
});

export default function Logger(options = {}) {
  switch (process.env.ENV) {
    case 'TEST':
      return (ctx, next) => next();
    case 'DEV':
      return developmentLogger;
    case 'PROD':
      return async function productionLogger(ctx, next) {
        if (!ctx.log) ctx.log = winstonInstance;
        await next();
      };
    default:
      return developmentLogger;
  }
}
