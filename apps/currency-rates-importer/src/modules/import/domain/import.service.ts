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
  private readonly PREVIOUS_DAYS_TO_FETCH_AMOUNT = 2;

  constructor(private readonly currencyFetcherService: CurrencyFetchService) {}

  // At minute 0 past every 3rd hour.
  @Cron('0 */3 * * *')
  async importCurrencyRates() {
    console.log('Currency rates deployment pipeline github actions');
    const startDate = moment().subtract(
      this.PREVIOUS_DAYS_TO_FETCH_AMOUNT,
      'day',
    );
    await this.importSupportedCurrenciesForDateRange(startDate);
  }

  // At 00:00 - on prod (check if all currencies are imported)
  @Cron('0 0 * * *')
  async ensureAllCurrencyRatesImported() {
    await this.importSupportedCurrenciesForDateRange();
  }

  async importSupportedCurrenciesForDateRange(
    startDate?: Moment | undefined,
    endDate?: Moment | undefined,
  ) {
    await this.currencyFetcherService.checkIfAllCurrenciesAreMigrated();

    for (const currency of SUPPORTED_CURRENCIES) {
      const currencyName = currency.name;
      if (currencyName === DEFAULT_APP_CURRENCY) continue;

      const shouldFetch =
        await this.currencyFetcherService.checkIfThereIsRateToFetch(
          currencyName,
        );

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
      await this.currencyFetcherService.saveCurrencyForDate(
        currencyName,
        startDateCopy,
      );
      startDateCopy.add(1, 'day');
    }
  }
}
