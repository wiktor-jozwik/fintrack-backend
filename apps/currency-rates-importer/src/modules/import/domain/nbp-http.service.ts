import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { nbpApiUrl } from '../../../common/constants/nbp-api-url';
import { lastValueFrom } from 'rxjs';
import { CurrencyNbpRate } from '../../../common/interfaces/currency-nbp-rate';

@Injectable()
class NbpHttpService {
  constructor(private readonly httpService: HttpService) {}

  async fetchCurrencyRateForDate(
    currencyName: string,
    isoDate: string,
    table = 'A',
  ): Promise<number> {
    const url = `${nbpApiUrl}/exchangerates/rates/${table}/${currencyName}/${isoDate}?format=json`;
    const currencyRateObservable = this.httpService.get(url);

    const currencyRateResponse = await lastValueFrom(currencyRateObservable);
    const currencyData: CurrencyNbpRate = currencyRateResponse.data;

    return currencyData.rates[0].mid;
  }
}

export default NbpHttpService;
