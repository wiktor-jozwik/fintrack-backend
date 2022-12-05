import { Currency } from '@prisma/client';

export const currencyStub = (): Currency => {
  return {
    id: 1,
    symbol: '$',
    name: 'USD',
  };
};
