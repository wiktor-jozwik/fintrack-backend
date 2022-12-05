import { UnprocessableEntityException } from '@nestjs/common';

export class CurrencyNotAddedException extends UnprocessableEntityException {
  constructor(idOrName: number | string) {
    if (typeof idOrName === 'string') {
      super(`Currency '${idOrName}' not added to account`);
    } else {
      super(`Currency with id: '${idOrName}' not added to account`);
    }
  }
}
