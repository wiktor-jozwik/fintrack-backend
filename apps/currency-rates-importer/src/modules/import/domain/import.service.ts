import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import CurrencyFetchService from './currency-fetch.service';
import { SUPPORTED_CURRENCIES } from '../../../common/constants/supported-currencies';
import * as moment from 'moment';
import { convertMomentToIsoDate } from '../../../common/utils/convert-moment-to-iso-date';

@Injectable()
export class ImportService {
  private readonly PREVIOUS_DAYS_TO_FETCH_AMOUNT = 7;

  constructor(private readonly currencyFetcherService: CurrencyFetchService) {}

  @Cron('*/1 * * * *')
  async importCurrencyRates() {
    for (const currency of SUPPORTED_CURRENCIES) {
      console.log(`Importing ${currency.name}`);
      if (currency.name === 'PLN') continue;

      const date = moment().subtract(this.PREVIOUS_DAYS_TO_FETCH_AMOUNT, 'day');

      await this.importCurrencyRatesForDateRange(currency.name, date);
    }
  }

  async importCurrencyRatesForDateRange(
    currencyName: string,
    startDate = moment('2002-01-02'),
    endDate = moment(),
  ) {
    while (
      convertMomentToIsoDate(endDate) !== convertMomentToIsoDate(startDate)
    ) {
      await this.currencyFetcherService.saveCurrencyForDate(
        currencyName,
        startDate,
      );
      startDate.add(1, 'day');
    }
  }
}
