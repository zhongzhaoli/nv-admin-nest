import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseCodeEnum } from '../enum/responseCode.enum';
import { format } from 'date-fns';

export interface SuccessResponseJson<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    response.status(HttpStatus.OK);
    return next.handle().pipe(
      map((data): SuccessResponseJson<any> => {
        return {
          code: ResponseCodeEnum.SUCCESS,
          message: 'success',
          data,
          timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
        };
      }),
    );
  }
}
