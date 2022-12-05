import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SKIP_USER_ACTIVE_CHECK } from '../../common/decorators';
import { AuthRequest } from '@app/common/interfaces';
import { AccountNotActiveException } from '@app/common/exceptions';

@Injectable()
export class UserIsActiveGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skipUserActiveCheck = this.reflector.getAllAndOverride<boolean>(
      SKIP_USER_ACTIVE_CHECK,
      [context.getHandler(), context.getClass()],
    );
    if (skipUserActiveCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user?.isActive) {
      throw new AccountNotActiveException();
    }

    return true;
  }
}
