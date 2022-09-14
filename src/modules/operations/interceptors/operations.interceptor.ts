import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { convertDatetimeToDate } from '../../../common/utils/convert-datetime-to-date';

@Injectable()
export class OperationsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((valueArray) => {
        valueArray.map((val: any) => {
          val.date = convertDatetimeToDate(val.date);
        });

        return valueArray;
      }),
    );
  }
}
