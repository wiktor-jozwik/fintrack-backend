import { Injectable, Logger } from '@nestjs/common';
import NbpHttpService from './nbp-http.service';
import * as moment from 'moment';
import { AxiosError } from 'axios';
import { Moment } from 'moment';
import { convertMomentToIsoDate } from '../../../common/utils/convert-moment-to-iso-date';
import { CurrencyRatesRepository } from '@app/database';

@Injectable()
class CurrencyFetchService {
  private readonly logger = new Logger(CurrencyFetchService.name);

  constructor(
    private readonly nbpHttpService: NbpHttpService,
    private readonly currencyRatesRepository: CurrencyRatesRepository,
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

export default CurrencyFetchService;
