import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { Moment } from 'moment';
import {
  DEFAULT_APP_CURRENCY,
  FIRST_CURRENCY_RATE_NBP_DATE,
  SUPPORTED_CURRENCIES,
} from '@app/common/constants';
import { CurrencyFetchService } from './currency-fetch.service';

@Injectable()
export class ImportService {
  readonly PREVIOUS_DAYS_TO_FETCH_AMOUNT = 3;

  constructor(private readonly currencyFetchService: CurrencyFetchService) {}

  // At minute 0 past every 3rd hour.
  @Cron('0 */3 * * *')
  async importCurrencyRates() {
    const startDate = moment().subtract(
      this.PREVIOUS_DAYS_TO_FETCH_AMOUNT,
      'day',
    );
    await this.importSupportedCurrenciesForDateRange(startDate);
  }

  // At 01:00 - on prod (check if all currencies are imported)
  @Cron('0 1 * * *')
  async ensureAllCurrencyRatesImported() {
    await this.importSupportedCurrenciesForDateRange();
  }

  async importSupportedCurrenciesForDateRange(
    startDate?: Moment | undefined,
    endDate?: Moment | undefined,
  ) {
    await this.currencyFetchService.checkIfAllCurrenciesAreMigrated();

    for (const currency of SUPPORTED_CURRENCIES) {
      const currencyName = currency.name;
      if (currencyName === DEFAULT_APP_CURRENCY) continue;

      const shouldFetch =
        await this.currencyFetchService.checkIfThereIsRateToFetch(currencyName);

      if (!shouldFetch) {
        continue;
      }

      await this.importCurrencyRatesForDateRange(
        currencyName,
        startDate,
        endDate,
      );
    }
  }

  async importCurrencyRatesForDateRange(
    currencyName: string,
    startDate = moment(FIRST_CURRENCY_RATE_NBP_DATE),
    endDate = moment(),
  ) {
    const startDateCopy = moment(startDate);
    while (startDateCopy <= endDate) {
      await this.currencyFetchService.saveCurrencyForDate(
        currencyName,
        startDateCopy,
      );
      startDateCopy.add(1, 'day');
    }
  }
}
