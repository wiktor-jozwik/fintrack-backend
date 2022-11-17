import { UnprocessableEntityException } from '@nestjs/common';
import { CsvImportWay } from '@app/common/enums';

export class CsvReaderNotImplementedException extends UnprocessableEntityException {
  constructor(csvImportWay: CsvImportWay) {
    super(`'${csvImportWay}' reader is not implemented yet`);
  }
}
