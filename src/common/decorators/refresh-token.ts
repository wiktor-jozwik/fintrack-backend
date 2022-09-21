import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../../modules/auth/interfaces/auth-request';

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    return request.user.refreshToken;
  },
);
