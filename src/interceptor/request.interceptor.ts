import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.logger.log(request.url, request.method);
    return next.handle();
  }
}
