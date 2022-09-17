import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(email: string | null) {
    let message = '';
    if (email) {
      message = ` '${email}'`;
      super(``);
    }
    super(`User${message} not found`);
  }
}
