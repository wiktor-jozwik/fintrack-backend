import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Currency, Operation } from '@prisma/client';
import { CurrencyRatesRepository } from '@app/database';
import { Cache } from 'cache-manager';
import { convertMomentToIsoDate } from '@app/common/utils';

@Injectable()
export class DefaultCurrencyOperationCalculatorService {
  constructor(
    private readonly currencyRatesRepository: CurrencyRatesRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getOperationCurrencyRateInDefaultCurrency(
    operation: Operation & { currency: Currency },
    defaultCurrencyName: string,
  ): Promise<number> {
    if (operation.currency.name === defaultCurrencyName) {
      return 1;
    }

    if (operation.currency.name === 'PLN') {
      const defaultCurrencyToPlnValue =
        await this.getCurrencyValueFromCacheOrDatabase(
          defaultCurrencyName,
          operation.date,
        );

      return 1 / defaultCurrencyToPlnValue;
    }

    const operationCurrencyToPlnValue =
      await this.getCurrencyValueFromCacheOrDatabase(
        operation.currency.name,
        operation.date,
      );

    if (!operationCurrencyToPlnValue) {
      return 0;
    }

    if (defaultCurrencyName === 'PLN') {
      return operationCurrencyToPlnValue;
    }

    const defaultCurrencyToPlnValue =
      await this.getCurrencyValueFromCacheOrDatabase(
        defaultCurrencyName,
        operation.date,
      );

    return operationCurrencyToPlnValue / defaultCurrencyToPlnValue;
  }

  private async findCurrency(currencyName: string, date: Date) {
    return await this.currencyRatesRepository.findCurrencyRateForDate(
      currencyName,
      date,
    );
  }

  private async getCurrencyValueFromCacheOrDatabase(
    currencyName: string,
    date: Date,
    ttlSeconds = 3600,
  ): Promise<number> {
    const currencyKey = this.getCurrencyCacheKey(currencyName, date);

    let currencyValue: number;

    const cachedCurrencyValue: string | undefined = await this.cacheManager.get(
      currencyKey,
    );

    console.log(`Cached [${currencyKey}]: ${cachedCurrencyValue}`);

    if (cachedCurrencyValue) {
      currencyValue = Number(cachedCurrencyValue);
    } else {
      const defaultCurrencyRateForDate = await this.findCurrency(
        currencyName,
        date,
      );
      if (!defaultCurrencyRateForDate) {
        return 0;
      }
      currencyValue = defaultCurrencyRateForDate.avgValue;

      await this.cacheManager.set(currencyKey, currencyValue, ttlSeconds);
    }

    return currencyValue;
  }

  private getCurrencyCacheKey(currencyName: string, date: Date) {
    return `${currencyName}PLN-${convertMomentToIsoDate(date)}`;
  }
}
