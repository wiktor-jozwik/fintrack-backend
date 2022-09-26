import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import {
  CsvOperationItem,
  OperationItem,
} from '../../interfaces/csv-operation-item';
import { CsvAbstractReader } from '../csv-abstract-reader';

@Injectable()
class CsvIngReader extends CsvAbstractReader {
  constructor() {
    super();
    this.headers = [
      'Data transakcji',
      'Data księgowania',
      'Dane kontrahenta',
      'Tytuł',
      'Nr rachunku',
      'Nazwa banku',
      'Szczegóły',
      'Nr transakcji',
      'Kwota transakcji (waluta rachunku)',
      'Waluta',
      'Kwota blokady/zwolnienie blokady',
      'Waluta',
      'Kwota płatności w walucie',
      'Waluta',
      'Konto',
      'Saldo po transakcji',
      'Waluta',
    ];
    this.delimiter = ';';
  }

  readCsv(
    filePath: string,
    callback: (csvOperationItem: OperationItem) => void,
  ) {
    console.log('READING CSV ING');

    const parseStream = this.makeParseStream();

    fs.createReadStream(filePath)
      .pipe(parseStream)
      .on('data', (row: any) => {
        const operationItem = this.changeNotFoundValuesToDefaults(
          this.prepareCsvOperationItem(row),
        );
        if (this.validateOperationItemCorrectness(operationItem)) {
          callback(operationItem);
        }
      });
  }

  prepareCsvOperationItem(row: any): CsvOperationItem {
    const { absMoneyAmount, categoryType } = this.getMoneyAmountAndCategoryType(
      row['Kwota transakcji (waluta rachunku)'],
    );
    return {
      referentialNumber: row['Nr transakcji'],
      originName: 'ING',
      isoDateString: row['Data transakcji'],
      absMoneyAmount,
      categoryType,
      operationName: row['Tytuł'],
      currencyName: row['Waluta'],
    };
  }
}

export default CsvIngReader;
