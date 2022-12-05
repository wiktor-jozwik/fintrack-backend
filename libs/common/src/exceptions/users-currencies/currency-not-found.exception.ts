import { NotFoundException } from '@nestjs/common';

export class CurrencyNotFoundException extends NotFoundException {
  constructor(currencyId: number) {
    super(`Currency with id: '${currencyId}' not found`);
  }
}
