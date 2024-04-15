import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LoggerService,
  HttpStatus,
} from '@nestjs/common';
import { ErrorResponseJson } from './types';
import { ResponseCodeEnum } from '../enum/responseCode.enum';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    let responseJson: ErrorResponseJson;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const exceptionMessage =
        exceptionResponse['message'] instanceof Array
          ? exceptionResponse['message'][0]
          : exceptionResponse['message'];
      // 状态码
      const code = exception.getStatus() || ResponseCodeEnum.REQUEST_BAD;
      // 错误信息
      const message = exceptionMessage || exception.message || exception.name;
      // 日志打印
      this.logger.error(message, code, ctx.getRequest().url);
      // 构建返回信息
      responseJson = {
        code,
        message,
        timestamp: new Date().toISOString(),
      };
    } else {
      this.logger.error(
        exception.toString(),
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        ctx.getRequest().url,
      );
      // 未知错误
      responseJson = {
        code: ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        message: exception.toString() as string,
        timestamp: new Date().toISOString(),
      };
    }
    response.status(HttpStatus.OK).json(responseJson);
  }
}
