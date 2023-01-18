import { UsersCurrencies } from '@prisma/client';

export const usersCurrenciesStub = (): UsersCurrencies => {
  return {
    currencyId: 1,
    userId: 1,
    createdAt: new Date('2022-12-12'),
  };
};
