interface Rate {
  no: string;
  effectiveDate: string;
  mid: number;
}

export interface CurrencyNbpRate {
  table: string;
  currency: string;
  code: string;
  rates: Rate[];
}
