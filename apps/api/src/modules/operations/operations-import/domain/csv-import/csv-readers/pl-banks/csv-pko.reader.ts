import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import {
  CsvOperationItem,
  OperationItem,
} from '../../interfaces/csv-operation-item';
import { CsvReader } from '../csv-reader';
import { slugifyString } from '../../../../../../../../../../libs/common/src/utils/slugify-string';

@Injectable()
class CsvPkoReader extends CsvReader {
  constructor() {
    super();
    this.headers = [
      'Data operacji',
      'Data waluty',
      'Typ transakcji',
      'Kwota',
      'Waluta',
      'Opis transakcji',
      '',
      '',
      '',
      '',
    ];
    this.delimiter = ',';
  }

  readCsv(
    filePath: string,
    callback: (csvOperationItem: OperationItem) => void,
  ) {
    console.log('READING CSV PKO');

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
      });
  }

  prepareCsvOperationItem(row: any): CsvOperationItem {
    const { absMoneyAmount, categoryType } = this.getMoneyAmountAndCategoryType(
      row['Kwota'],
    );

    return {
      referentialNumber: this.prepareReferentialNumber(row),
      originName: 'PKO',
      isoDateString: this.getIsoDateString(row['Data operacji']),
      absMoneyAmount,
      categoryType,
      categoryName: row['Typ transakcji'],
      operationName: row['Opis transakcji'],
      currencyName: row['Waluta'],
    };
  }

  private prepareReferentialNumber(row: any): string {
    return slugifyString(
      `${row['Data operacji']}_${row['Data waluty']}_${row['Kwota']}_${row['Opis transakcji']}`,
    );
  }
}

export default CsvPkoReader;
