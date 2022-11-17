import { InternalServerErrorException } from '@nestjs/common';

export class CurrencyRateDataShortageException extends InternalServerErrorException {
  constructor() {
    super(
      'There is no data for some of your requested currencies. Contact administrator please',
    );
  }
}
