import { UnprocessableEntityException } from '@nestjs/common';

export class CurrencyNotSupportedException extends UnprocessableEntityException {
  constructor(name: string) {
    super(`Currency '${name}' not supported`);
  }
}
