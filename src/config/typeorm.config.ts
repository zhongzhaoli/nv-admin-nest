import { DataSource, DataSourceOptions } from 'typeorm';
import { getEnvConfig } from '../utils/dotenv.helper';
import { ConfigEnum } from '../enum/config.enum';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const buildConnectionOptions = (): TypeOrmModuleOptions => {
  const config = getEnvConfig();
  const entities =
    process.env.NODE_ENV === 'test'
      ? [__dirname + '/../**/*.entity.ts']
      : [__dirname + '/../**/*.entity{.js,.ts}'];
  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    synchronize: config[ConfigEnum.DB_SYNC] === 'true',
    logging: config[ConfigEnum.DB_LOGGING] === 'true',
    entities,
  } as TypeOrmModuleOptions;
};

export const connectionParams = buildConnectionOptions();

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
