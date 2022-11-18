import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { Moment } from 'moment';
import { SUPPORTED_CURRENCIES } from '@app/common/constants';
import { CurrencyFetchService } from './currency-fetch.service';

@Injectable()
export class ImportService {
  private readonly PREVIOUS_DAYS_TO_FETCH_AMOUNT = 7;

  constructor(private readonly currencyFetcherService: CurrencyFetchService) {}

  @Cron('0 */12 * * *')
  async importCurrencyRates() {
    const startDate = moment().subtract(
      this.PREVIOUS_DAYS_TO_FETCH_AMOUNT,
      'day',
    );
    await this.importSupportedCurrenciesForDateRange(startDate);
  }

  // at 00:00 on Sunday - on prod (check if all currencies are imported)
  @Cron('0 0 * * 0')
  // @Cron('0 */2 * * *')
  async ensureAllCurrencyRatesImported() {
    await this.importSupportedCurrenciesForDateRange();
  }

  async importSupportedCurrenciesForDateRange(
    startDate?: Moment | undefined,
    endDate?: Moment | undefined,
  ) {
    for (const currency of SUPPORTED_CURRENCIES) {
      if (currency.name === 'PLN') continue;

      await this.importCurrencyRatesForDateRange(
        currency.name,
        startDate,
        endDate,
      );
    }
  }

  async importCurrencyRatesForDateRange(
    currencyName: string,
    startDate = moment('2002-01-02'),
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
