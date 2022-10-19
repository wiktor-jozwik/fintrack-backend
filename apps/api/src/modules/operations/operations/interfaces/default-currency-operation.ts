import { Category } from '@prisma/client';

export interface DefaultCurrencyOperation {
  name: string;
  moneyAmountInDefaultCurrency: number;
  date: Date;
  category: Category;
}
