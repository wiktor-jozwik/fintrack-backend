import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AccountNotActiveException } from '../../modules/auth/exceptions/account-not-active.exception';
import { AuthRequest } from '../../modules/auth/interfaces/auth-request';
import { Reflector } from '@nestjs/core';
import { ACCEPT_NOT_ACTIVE_USER_KEY } from '../decorators/accept-not-active-user';

@Injectable()
export class UserIsActiveGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const notActiveUser = this.reflector.getAllAndOverride<boolean>(
      ACCEPT_NOT_ACTIVE_USER_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (notActiveUser) {
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
