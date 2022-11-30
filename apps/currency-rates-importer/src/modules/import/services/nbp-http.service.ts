import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CurrencyNbpRate } from '../../../common/interfaces/currency-nbp-rate';

@Injectable()
export class NbpHttpService {
  private readonly NBP_API_URL = 'http://api.nbp.pl/api';

  constructor(private readonly httpService: HttpService) {}

  async fetchCurrencyRateForDate(
    currencyName: string,
    isoDate: string,
    table = 'A',
  ): Promise<number> {
    const url = `${this.NBP_API_URL}/exchangerates/rates/${table}/${currencyName}/${isoDate}?format=json`;
    const currencyRateObservable = this.httpService.get(url);

    const currencyRateResponse = await lastValueFrom(currencyRateObservable);
    const currencyData: CurrencyNbpRate = currencyRateResponse.data;

    return currencyData.rates[0].mid;
  }
}
