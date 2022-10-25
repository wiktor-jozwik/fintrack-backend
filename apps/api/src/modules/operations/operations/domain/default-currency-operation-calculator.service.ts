import { Injectable } from '@nestjs/common';
import { Currency, Operation } from '@prisma/client';
import { CurrencyRatesRepository } from '@app/database';

@Injectable()
export class DefaultCurrencyOperationCalculatorService {
  constructor(
    private readonly currencyRatesRepository: CurrencyRatesRepository,
  ) {}

  async getOperationCurrencyRateInDefaultCurrency(
    operation: Operation & { currency: Currency },
    defaultCurrencyName: string,
  ): Promise<number> {
    if (operation.currency.name === defaultCurrencyName) {
      return 1;
    }

    if (operation.currency.name === 'PLN') {
      const defaultCurrencyRateForDate = await this.findCurrency(
        defaultCurrencyName,
        operation.date,
      );
      if (!defaultCurrencyRateForDate) {
        return 0;
      }

      return 1 / defaultCurrencyRateForDate.avgValue;
    }

    const operationCurrencyRateForDate = await this.findCurrency(
      operation.currency.name,
      operation.date,
    );

    if (!operationCurrencyRateForDate) {
      return 0;
    }

    if (defaultCurrencyName === 'PLN') {
      return operationCurrencyRateForDate.avgValue;
    }

    const defaultCurrencyRateForDate = await this.findCurrency(
      defaultCurrencyName,
      operation.date,
    );

    if (!defaultCurrencyRateForDate) {
      return 0;
    }

    return (
      operationCurrencyRateForDate.avgValue /
      defaultCurrencyRateForDate.avgValue
    );
  }

  private async findCurrency(currencyName: string, date: Date) {
    return await this.currencyRatesRepository.findCurrencyRateForDate(
      currencyName,
      date,
    );
  }
}
