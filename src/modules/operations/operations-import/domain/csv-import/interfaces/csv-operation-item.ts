import { CategoryType } from '../../../../../../common/enums/category-type.enum';

export interface CsvOperationItem {
  referentialNumber: string;
  originName: string;
  isoDateString: string;
  absMoneyAmount: number;
  operationName?: string;
  categoryType: CategoryType;
  categoryName?: string;
  currencyName?: string;
}

export interface OperationItem {
  referentialNumber: string;
  originName: string;
  isoDateString: string;
  absMoneyAmount: number;
  operationName: string;
  categoryType: CategoryType;
  currencyName: string;
  categoryName: string;
}
