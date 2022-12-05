import { BadRequestException } from '@nestjs/common';

export class DefaultCurrencyDeleteException extends BadRequestException {
  constructor(currencyName: string) {
    super(`Cannot delete '${currencyName}' as it is the default currency`);
  }
}
