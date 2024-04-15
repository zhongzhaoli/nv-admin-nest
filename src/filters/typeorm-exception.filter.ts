import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { ResponseCodeEnum } from '../enum/responseCode.enum';
import { TypeORMError, QueryFailedError } from 'typeorm';
import { ErrorResponseJson } from './types';

@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: TypeORMError, host: ArgumentsHost): void {
    if (exception instanceof QueryFailedError) {
      console.log('find a QueryFailedError');
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // 状态码
    const code = ResponseCodeEnum.INTERNAL_SERVER_ERROR;
    // 错误信息
    const message = exception.message || exception.name;
    // 日志打印
    this.logger.error(message, code, ctx.getRequest().url);
    // 构建返回信息
    const responseJson: ErrorResponseJson = {
      code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    };
    response.status(HttpStatus.OK).json(responseJson);
  }
}
