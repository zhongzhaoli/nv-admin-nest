import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { RequestInterceptor } from './interceptor/request.interceptor';

export const setupApp = (app: INestApplication): void => {
  // 日志模块
  const logger = new Logger();
  // 管道
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // 过滤器
  app.useGlobalFilters(
    new TypeormExceptionFilter(logger),
    new AllExceptionFilter(logger),
  );
  // 拦截器
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new RequestInterceptor(logger),
  );
  // 统一前缀
  app.setGlobalPrefix('api');
};
