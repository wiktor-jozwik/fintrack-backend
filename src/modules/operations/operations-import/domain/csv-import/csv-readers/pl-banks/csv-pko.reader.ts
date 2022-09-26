import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import {
  CsvOperationItem,
  OperationItem,
} from '../../interfaces/csv-operation-item';
import { CsvAbstractReader } from '../csv-abstract-reader';

@Injectable()
class CsvPkoReader extends CsvAbstractReader {
  // TODO
  constructor() {
    super();
    this.headers = ['Data transakcji'];
    this.delimiter = ';';
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
        // TODO
        // const csvOperationItem: CsvOperationItem =
        //   this.prepareCsvOperationItem(row);

        callback(row);
      });
  }

  getIsoDateString(rawDate: string): string {
    return '';
  }

  prepareCsvOperationItem(row: any): CsvOperationItem {
    return row;
  }
}

export default CsvPkoReader;
