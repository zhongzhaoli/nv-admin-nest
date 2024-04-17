import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnvConfig } from './utils/dotenv.helper';
import { winstonLogger } from './config/winston.config';
import { ConfigEnum } from './enum/config.enum';
import { setupApp } from './setup';

async function bootstrap() {
  const config = getEnvConfig();
  const logger = winstonLogger;
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.enableCors({
    origin: true,
    methods: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  setupApp(app);
  await app.listen(config[ConfigEnum.APP_PORT] as number);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
