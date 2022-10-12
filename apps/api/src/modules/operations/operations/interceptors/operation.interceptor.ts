import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { convertDatetimeToDate } from '../../../../common/utils/convert-datetime-to-date';

@Injectable()
export class OperationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        value.date = convertDatetimeToDate(value.date);

        return value;
      }),
    );
  }
}
