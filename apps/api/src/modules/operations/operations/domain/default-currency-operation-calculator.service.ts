import { Injectable } from '@nestjs/common';
import { Currency, Operation } from '@prisma/client';
import { OperationCurrencyRateNotFoundException } from '../../operations/exceptions/operation-currency-rate-not-found.exception';
import CurrencyRatesRepository from '../../../../database/repositories/currency-rates.repository';

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
      const defaultCurrencyRateForDate = await this.findCurrencyRateOrThrow(
        defaultCurrencyName,
        operation.date,
      );
      return 1 / defaultCurrencyRateForDate.avgValue;
    }

    const operationCurrencyRateForDate = await this.findCurrencyRateOrThrow(
      operation.currency.name,
      operation.date,
    );

    if (defaultCurrencyName === 'PLN') {
      return operationCurrencyRateForDate.avgValue;
    }

    const defaultCurrencyRateForDate = await this.findCurrencyRateOrThrow(
      defaultCurrencyName,
      operation.date,
    );

    return (
      operationCurrencyRateForDate.avgValue /
      defaultCurrencyRateForDate.avgValue
    );
  }

  private async findCurrencyRateOrThrow(currencyName: string, date: Date) {
    const operationCurrencyRateForDate =
      await this.currencyRatesRepository.findCurrencyRateForDate(
        currencyName,
        date,
      );

    if (!operationCurrencyRateForDate) {
      throw new OperationCurrencyRateNotFoundException(currencyName, date);
    }

    return operationCurrencyRateForDate;
  }
}
