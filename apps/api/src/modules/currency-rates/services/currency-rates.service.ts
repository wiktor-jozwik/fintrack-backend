import { Injectable } from '@nestjs/common';
import { SearchCurrencyRatesDto } from '../dto';
import { CurrencyRatesRepository } from '@app/database';
import { CurrencyRateDataShortageException } from '@app/common/exceptions';
import { convertDatetimeToDate } from '@app/common/utils';
import { CurrencyRateValueOnDateResponse } from '../responses';
import { DEFAULT_APP_CURRENCY } from '@app/common/constants';

@Injectable()
export class CurrencyRatesService {
  constructor(
    private readonly currencyRatesRepository: CurrencyRatesRepository,
  ) {}

  async findAll(
    query: SearchCurrencyRatesDto,
  ): Promise<CurrencyRateValueOnDateResponse[]> {
    const { baseCurrency, currency, startDate, endDate } = query;

    if (currency === DEFAULT_APP_CURRENCY) {
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

    if (baseCurrency === DEFAULT_APP_CURRENCY) {
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

    const baseCurrencyRateValues: CurrencyRateValueOnDateResponse[] = [];

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
