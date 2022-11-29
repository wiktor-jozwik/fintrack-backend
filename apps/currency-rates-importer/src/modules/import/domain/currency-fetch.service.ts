import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { AxiosError } from 'axios';
import { Moment } from 'moment';
import { convertMomentToIsoDate } from '@app/common/utils';
import { CurrenciesRepository, CurrencyRatesRepository } from '@app/database';
import { NbpHttpService } from './nbp-http.service';
import {
  FIRST_CURRENCY_RATE_NBP_DATE,
  SUPPORTED_CURRENCIES,
} from '@app/common/constants';

@Injectable()
export class CurrencyFetchService {
  private readonly logger = new Logger(CurrencyFetchService.name);

  constructor(
    private readonly nbpHttpService: NbpHttpService,
    private readonly currencyRatesRepository: CurrencyRatesRepository,
    private readonly currenciesRepository: CurrenciesRepository,
  ) {}

  async saveCurrencyForDate(name: string, date: Moment) {
    const isoDateString = convertMomentToIsoDate(date);
    const alreadySavedRate =
      await this.currencyRatesRepository.findCurrencyRateForDate(
        name,
        new Date(isoDateString),
      );

    if (alreadySavedRate) {
      this.logger.log(
        `Rate for currency '${name}' on ${isoDateString} is already saved`,
      );
      return;
    }

    try {
      const avgValue = await this.nbpHttpService.fetchCurrencyRateForDate(
        name,
        isoDateString,
      );

      await this.currencyRatesRepository.create({
        date: new Date(isoDateString),
        avgValue,
        currency: {
          connect: {
            name,
          },
        },
      });

      this.logger.log(`Saved rate for currency '${name}' on ${isoDateString}`);
    } catch (err) {
      if (this.checkIfShouldTakePreviousDayRate(err)) {
        await this.savePreviousDayRate(name, isoDateString);
      } else {
        this.logger.error(err.message);
      }
    }
  }

  async checkIfAllCurrenciesAreMigrated(): Promise<void> {
    const savedCurrenciesCount = await this.currenciesRepository.count();

    if (savedCurrenciesCount !== SUPPORTED_CURRENCIES.length) {
      for (const currency of SUPPORTED_CURRENCIES) {
        await this.currenciesRepository.upsert(currency);
      }
    }
  }

  async checkIfThereIsRateToFetch(name: string): Promise<boolean> {
    const daysFromNbpFirstDate =
      moment().diff(moment(FIRST_CURRENCY_RATE_NBP_DATE), 'days') + 1;
    const savedCurrenciesCount =
      await this.currencyRatesRepository.countCurrency(name);
    if (savedCurrenciesCount === daysFromNbpFirstDate) {
      this.logger.log(`Currency '${name}' has all rates saved`);
      return false;
    }

    return true;
  }

  private checkIfShouldTakePreviousDayRate(axiosResponse: AxiosError) {
    return (
      axiosResponse.response?.status === 404 &&
      axiosResponse.response?.statusText
    );
  }

  private async savePreviousDayRate(name: string, date: string) {
    const previousDayRate =
      await this.currencyRatesRepository.findCurrencyRateForDate(
        name,
        new Date(convertMomentToIsoDate(moment(date).subtract(1, 'day'))),
      );

    if (!previousDayRate) {
      throw Error(`Currency: '${name}' is not saved for ${date}`);
    }

    await this.currencyRatesRepository.create({
      avgValue: previousDayRate.avgValue,
      date: new Date(date),
      currency: {
        connect: {
          id: previousDayRate.currencyId,
        },
      },
    });

    this.logger.log(`Saved rate for currency '${name}' on previous date`);
  }
}
