import { Injectable } from '@nestjs/common';
import { Currency } from '@prisma/client';
import { CurrencyNotSupportedException } from '@app/common/exceptions';
import { CurrenciesRepository } from '@app/database';

@Injectable()
export class CurrenciesValidatorService {
  constructor(private readonly currenciesRepository: CurrenciesRepository) {}

  async findAndValidateCurrency(name: string): Promise<Currency> {
    const currency = await this.currenciesRepository.findByName(name);

    if (!currency) {
      throw new CurrencyNotSupportedException(name);
    }

    return currency;
  }
}
