import { UnprocessableEntityException } from '@nestjs/common';
import { CsvImportWay } from '@api/modules/operations/operations-import/enums/csv-import-way.enum';

export class CsvReaderNotImplementedException extends UnprocessableEntityException {
  constructor(csvImportWay: CsvImportWay) {
    super(`'${csvImportWay}' reader is not implemented yet`);
  }
}
