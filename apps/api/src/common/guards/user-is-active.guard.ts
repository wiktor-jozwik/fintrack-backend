import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AccountNotActiveException } from '../../modules/auth/exceptions/account-not-active.exception';
import { AuthRequest } from '../../modules/auth/interfaces/auth-request';
import { Reflector } from '@nestjs/core';
import { SKIP_USER_ACTIVE_CHECK } from '../decorators/skip-user-active-check';

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
