import { NbpRate } from './nbp-rate';

export interface CurrencyNbpRate {
  table: string;
  currency: string;
  code: string;
  rates: NbpRate[];
}
