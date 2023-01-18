import { Category, CategoryType } from '@prisma/client';

export const categoryStub = (): Category => {
  return {
    id: 1,
    type: CategoryType.OUTCOME,
    name: 'Taxes',
    isInternal: false,
    userId: 5,
  };
};
