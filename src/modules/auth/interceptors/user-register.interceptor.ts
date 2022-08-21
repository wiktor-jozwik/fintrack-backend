import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class UserRegisterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        value.password = undefined;
        value.createdAt = undefined;
        value.updatedAt = undefined;

        return value;
      }),
    );
  }

  private interceptDate(date: Date) {
    return moment(date).format(moment.HTML5_FMT.DATE);
  }
}
