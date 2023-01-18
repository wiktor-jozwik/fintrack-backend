import { Operation, Prisma } from '@prisma/client';

export const operationStub = (): Operation => {
  return {
    id: 2,
    currencyId: 10,
    categoryId: 4,
    date: new Date('2022-01-01'),
    name: 'test operation',
    moneyAmount: new Prisma.Decimal(20),
    origin: null,
    referentialNumber: null,
  };
};
