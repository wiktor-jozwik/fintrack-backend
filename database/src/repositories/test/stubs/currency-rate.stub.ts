import { CurrencyRate } from '@prisma/client';

export const currencyRateStub = (): CurrencyRate => {
  return {
    id: 10,
    currencyId: 2,
    date: new Date('2023-01-01'),
    avgValue: 4.265,
  };
};
