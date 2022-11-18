import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as moment from 'moment';
import { CsvOperationItem, OperationItem } from '../../interfaces';
import { CsvReader } from '../csv-reader';

@Injectable()
export class CsvPekaoReader extends CsvReader {
  constructor() {
    super();
    this.headers = [
      'Data księgowania',
      'Data waluty',
      'Nadawca / Odbiorca',
      'Adres nadawcy / odbiorcy',
      'Rachunek źródłowy',
      'Rachunek docelowy',
      'Tytułem',
      'Kwota operacji',
      'Waluta',
      'Numer referencyjny',
      'Typ operacji',
      'Kategoria',
    ];
    this.delimiter = ';';
  }

  readCsv(
    filePath: string,
    callback: (csvOperationItem: OperationItem) => void,
  ) {
    console.log('READING CSV PEKAO');
    const parseStream = this.makeParseStream();

    fs.createReadStream(filePath)
      .pipe(parseStream)
      .on('data', (row: any) => {
        const csvOperationItem = this.prepareCsvOperationItem(row);

        const operationItem =
          this.changeNotFoundValuesToDefaults(csvOperationItem);

        if (this.validateOperationItemCorrectness(operationItem)) {
          callback(operationItem);
        }
      })
      .on('error', (err: unknown) => {
        console.error(err);
      });
  }

  prepareCsvOperationItem(row: any): CsvOperationItem {
    const { absMoneyAmount, categoryType } = this.getMoneyAmountAndCategoryType(
      row['Kwota operacji'],
    );

    return {
      referentialNumber: row['Numer referencyjny'],
      originName: 'PEKAO',
      isoDateString: this.getIsoDateString(row['Data księgowania']),
      absMoneyAmount,
      categoryType,
      categoryName: row['Kategoria'],
      operationName: row['Tytułem'],
      currencyName: row['Waluta'],
    };
  }

  getIsoDateString(rawDate: string): string {
    return moment(rawDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
  }
}
