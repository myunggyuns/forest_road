import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context}] ${level}: ${message}  ${
          trace ? `\n${trace}` : ''
        }`;
      }),
    ),
  }),
];

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports,
});

@Injectable()
export class LoggerService {
  log(message: string, context?: string) {
    logger.info(message, { context });
  }
  error(message: string, trace: string, context?: string) {
    logger.error(message, { context, trace });
  }
  warn(message: string, context?: string) {
    logger.warn(message, { context });
  }
  debug(message: string, context?: string) {
    logger.debug(message, { context });
  }
}
