import {
  AbsMoneyAmountCategoryType,
  CsvOperationItem,
  OperationItem,
} from '../interfaces';
import { parse } from 'csv-parse';
import { CategoryType } from '@prisma/client';

export abstract class CsvReader {
  private readonly DEFAULT_CATEGORY_NAME = 'Default category';
  private readonly DEFAULT_OPERATION_NAME = 'Default operation name';
  private readonly DEFAULT_CURRENCY_NAME = 'PLN';

  headers: string[];
  delimiter: string;

  abstract readCsv(
    filePath: string,
    callback: (csvOperationItem: OperationItem) => void,
  ): void;

  abstract prepareCsvOperationItem(row: any): CsvOperationItem;

  changeNotFoundValuesToDefaults(
    csvOperationItem: CsvOperationItem,
  ): OperationItem {
    return {
      ...csvOperationItem,
      categoryName: csvOperationItem.categoryName || this.DEFAULT_CATEGORY_NAME,
      operationName:
        csvOperationItem.operationName || this.DEFAULT_OPERATION_NAME,
      currencyName: csvOperationItem.currencyName || this.DEFAULT_CURRENCY_NAME,
    };
  }

  validateOperationItemCorrectness(
    csvOperationItem: CsvOperationItem,
  ): boolean {
    if (
      !csvOperationItem.referentialNumber ||
      csvOperationItem.absMoneyAmount === 0 ||
      csvOperationItem.isoDateString === 'Invalid date'
    ) {
      return false;
    }

    return true;
  }

  makeParseStream() {
    return parse({
      delimiter: this.delimiter,
      columns: this.headers,
      fromLine: 2,
    });
  }

  getIsoDateString(rawDate: string): string {
    return rawDate;
  }

  getMoneyAmountAndCategoryType(
    rawMoneyAmount: string,
  ): AbsMoneyAmountCategoryType {
    let categoryType: CategoryType = CategoryType.INCOME;
    const moneyAmount = +rawMoneyAmount.replace(',', '.').replace(/\s+/, '');

    if (moneyAmount < 0) {
      categoryType = CategoryType.OUTCOME;
    }

    return {
      absMoneyAmount: Math.abs(moneyAmount),
      categoryType,
    };
  }
}
