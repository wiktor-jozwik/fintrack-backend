import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '@app/common/interfaces';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    return request.user.id;
  },
);
