import { NotFoundException } from '@nestjs/common';

export class UserAlreadyActiveException extends NotFoundException {
  constructor(email: string) {
    super(`User '${email}' is already active`);
  }
}
