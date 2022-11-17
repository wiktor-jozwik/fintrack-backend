import { UnprocessableEntityException } from '@nestjs/common';

export class PasswordsDoNotMatchException extends UnprocessableEntityException {
  constructor() {
    super(`Passwords do not match`);
  }
}
