import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UserProfileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        console.log(value);
        value.user.password = undefined;
        value.user.isActive = undefined;
        value.user.updatedAt = undefined;
        value.user.createdAt = undefined;

        return value;
      }),
    );
  }
}
