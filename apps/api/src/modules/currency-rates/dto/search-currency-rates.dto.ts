import { IsDateString, IsString } from 'class-validator';

export class SearchCurrencyRatesDto {
  @IsString()
  baseCurrency: string;

  @IsString()
  currency: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
