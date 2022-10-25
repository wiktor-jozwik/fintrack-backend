import { UnprocessableEntityException } from '@nestjs/common';
import { CsvImportWay } from '../enums/csv-import-way.enum';

export class CsvReaderNotImplementedException extends UnprocessableEntityException {
  constructor(csvImportWay: CsvImportWay) {
    super(`'${csvImportWay}' reader is not implemented yet`);
  }
}
