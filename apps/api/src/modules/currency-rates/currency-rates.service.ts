import { Injectable } from '@nestjs/common';
import { SearchCurrencyRatesDto } from '@api/modules/currency-rates/dto/search-currency-rates.dto';
import { CurrencyRatesRepository } from '@app/database';
import { CurrencyRateDataShortageException } from '@api/exceptions';
import { CurrencyRateValueOnDate } from '@api/modules/currency-rates/interfaces';
import { convertDatetimeToDate } from '@app/common/utils';

@Injectable()
export class CurrencyRatesService {
  constructor(
    private readonly currencyRatesRepository: CurrencyRatesRepository,
  ) {}

  async findAll(
    query: SearchCurrencyRatesDto,
  ): Promise<CurrencyRateValueOnDate[]> {
    const { baseCurrency, currency, startDate, endDate } = query;

    if (currency === 'PLN') {
      const baseCurrencyRates =
        await this.currencyRatesRepository.findCurrencyRatesForDates(
          baseCurrency,
          startDate,
          endDate,
        );

      return baseCurrencyRates.map((currencyRate) => ({
        date: convertDatetimeToDate(currencyRate.date),
        value: 1 / currencyRate.avgValue,
      }));
    }

    const currencyRates =
      await this.currencyRatesRepository.findCurrencyRatesForDates(
        currency,
        startDate,
        endDate,
      );

    if (baseCurrency === 'PLN') {
      return currencyRates.map((currencyRate) => ({
        date: convertDatetimeToDate(currencyRate.date),
        value: currencyRate.avgValue,
      }));
    }

    const baseCurrencyRates =
      await this.currencyRatesRepository.findCurrencyRatesForDates(
        baseCurrency,
        startDate,
        endDate,
      );

    if (currencyRates.length !== baseCurrencyRates.length) {
      throw new CurrencyRateDataShortageException();
    }

    const baseCurrencyRateValues: CurrencyRateValueOnDate[] = [];

    for (let i = 0; i < currencyRates.length; i++) {
      const value = currencyRates[i].avgValue / baseCurrencyRates[i].avgValue;

      baseCurrencyRateValues.push({
        date: convertDatetimeToDate(currencyRates[i].date),
        value: value,
      });
    }

    return baseCurrencyRateValues;
  }
}
