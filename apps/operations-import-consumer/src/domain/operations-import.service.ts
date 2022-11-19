import { Injectable } from '@nestjs/common';
import { CsvReader } from './csv-import/csv-readers';
import { CsvImporter } from './csv-import';
import { CsvReaderNotImplementedException } from '@app/common/exceptions';
import { CsvImportWay } from '@app/common/enums';
import { CsvReaderCreator } from './csv-import/csv-readers/csv-reader-creator';

@Injectable()
export class OperationsImportService {
  constructor(
    private readonly csvImporter: CsvImporter,
    private readonly csvReaderCreator: CsvReaderCreator,
  ) {}

  async import(filePath: string, userId: number, csvImportWay: CsvImportWay) {
    const reader: CsvReader = this.csvReaderCreator.create(csvImportWay);
    if (!reader) {
      throw new CsvReaderNotImplementedException(csvImportWay);
    }

    this.csvImporter.setReader(reader);

    this.csvImporter.import(filePath, userId);
  }
}
