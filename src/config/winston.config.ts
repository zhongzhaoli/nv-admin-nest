import { WinstonModule, utilities } from 'nest-winston';
import { ConfigEnum } from '../enum/config.enum';
import { getEnvConfig } from '../utils/dotenv.helper';
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

// 配置文件
const config = getEnvConfig();
// 默认日志配置 - 文件输出
const defaultLogConfig = {
  dirname: config[ConfigEnum.LOG_DIRNAME] as string,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(
    format.timestamp(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
};

const instance = createLogger({
  transports: [
    // 终端打印
    new transports.Console({
      format: format.combine(format.timestamp(), utilities.format.nestLike()),
    }),
    ...(config[ConfigEnum.LOG_FILE] === 'true'
      ? [
          // 文件输出 - info及以上Level的日志
          new transports.DailyRotateFile({
            ...defaultLogConfig,
            level: 'info',
            filename: 'application-info-%DATE%.log',
          }),
          // 文件输出 - warn及以上Level的日志
          new transports.DailyRotateFile({
            ...defaultLogConfig,
            level: 'warn',
            filename: 'application-warn-%DATE%.log',
          }),
        ]
      : []),
  ],
});

export const winstonLogger = WinstonModule.createLogger({
  instance,
});
