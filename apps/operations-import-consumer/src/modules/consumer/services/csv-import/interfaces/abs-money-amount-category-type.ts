import { CategoryType } from '@prisma/client';

export interface AbsMoneyAmountCategoryType {
  absMoneyAmount: number;
  categoryType: CategoryType;
}
