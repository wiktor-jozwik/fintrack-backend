import { UnprocessableEntityException } from '@nestjs/common';

export class CurrencyNotAddedException extends UnprocessableEntityException {
  constructor(name: string) {
    super(`Currency '${name}' not added to account`);
  }
}
