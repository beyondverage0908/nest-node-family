import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export default WinstonModule.forRoot({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      level: 'info', // 日志级别
      filename: `${process.cwd()}/logs/%DATE%.info.log`, // 日志文件名，%DATE% 会被自动替换为日期
      datePattern: 'YYYY-MM-DD', // 日期格式
      zippedArchive: true, // 是否压缩存档文件
      maxSize: '20m', // 单个日志文件大小限制
      maxFiles: '14d', // 保留日志文件的天数
    }),
    new DailyRotateFile({
      level: 'error', // 日志级别
      filename: `${process.cwd()}/logs/%DATE%.error.log`, // 日志文件名
      datePattern: 'YYYY-MM-DD', // 日期格式
      zippedArchive: true, // 是否压缩存档文件
      maxSize: '20m', // 单个日志文件大小限制
      maxFiles: '14d', // 保留日志文件的天数
    }),
    new DailyRotateFile({
      level: 'warn', // 日志级别
      filename: `${process.cwd()}/logs/%DATE%.warn.log`, // 日志文件名
      datePattern: 'YYYY-MM-DD', // 日期格式
      zippedArchive: true, // 是否压缩存档文件
      maxSize: '20m', // 单个日志文件大小限制
      maxFiles: '14d', // 保留日志文件的天数
    }),
    new DailyRotateFile({
      level: 'debug', // 日志级别
      filename: `${process.cwd()}/logs/%DATE%.debug.log`, // 日志文件名
      datePattern: 'YYYY-MM-DD', // 日期格式
      zippedArchive: true, // 是否压缩存档文件
      maxSize: '20m', // 单个日志文件大小限制
      maxFiles: '14d', // 保留日志文件的天数
    }),
  ],
});
