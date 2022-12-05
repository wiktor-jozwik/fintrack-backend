import { UnprocessableEntityException } from '@nestjs/common';

export class AccountNotActiveException extends UnprocessableEntityException {
  constructor() {
    super(`Account is inactive, please activate it first and then login`);
  }
}
