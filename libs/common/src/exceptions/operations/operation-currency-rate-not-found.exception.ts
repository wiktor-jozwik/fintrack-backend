import { NotFoundException } from '@nestjs/common';

export class OperationCurrencyRateNotFoundException extends NotFoundException {
  constructor(currencyName: string, date: Date) {
    super(`Currency rate for '${currencyName}' on '${date}' not found`);
  }
}
