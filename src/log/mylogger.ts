import { LoggerService, LogLevel } from "@nestjs/common";
import winston from "winston";
import chalk from "chalk";
import dayjs from 'dayjs'

export class MyLogger implements LoggerService{
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const coloredLevel = chalk.greenBright(level.toUpperCase());
          const strApp = chalk.green('[Nest]')
          const strContext = chalk.yellow(`[${String(context)}]`);
          return `${strApp} - ${String(timestamp)} - ${coloredLevel} - ${strContext} - ${String(message)}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: 'logs',
          filename: 'app.log',
          maxsize: 2 * 1024 * 1024, // 2MB
          format: winston.format.json(),
        })
      ],
    });
  }
  
  log(message: any, context: any) {
    const timestamp = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss A');
    this.logger.log('info',message, { context, timestamp });
  }
  error(message: any, context: any) {
    const timestamp = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss A');
    this.logger.log('error', message, { context, timestamp });
  }
  warn(message: any, context: any) {
    const timestamp = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss A');
    this.logger.log('warn', message, { context, timestamp });
  }
  debug?(message: any, context: any) {
    const timestamp = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss A');
    this.logger.log('debug', message, { context, timestamp });
  }
  verbose?(message: any, context: any) {
    const timestamp = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss A');
    this.logger.log('verbose', message, { context, timestamp });
  }
  fatal?(message: any, context: any) {
    const timestamp = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss A');
    this.logger.log('fatal', message, { context, timestamp });
  }
  setLogLevels?(levels: LogLevel[]) {
    console.log(levels)
  }

}