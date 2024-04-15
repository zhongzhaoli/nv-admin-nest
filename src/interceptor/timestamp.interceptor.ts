import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { format } from 'date-fns';

@Injectable()
export class TimestampInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data: any) => {
        if (data && data instanceof Object) {
          if (data.hasOwnProperty('createTime')) {
            data.createTime = format(data.createTime, 'yyyy-MM-dd HH:mm:ss');
          }
          if (data.hasOwnProperty('updateTime')) {
            data.updateTime = format(data.updateTime, 'yyyy-MM-dd HH:mm:ss');
          }
        }
        return data;
      }),
    );
  }
}
