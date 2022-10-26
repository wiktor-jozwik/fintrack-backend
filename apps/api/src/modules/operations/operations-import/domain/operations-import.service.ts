import { Injectable } from '@nestjs/common';
import { ImportOperationsDto } from '../dto';
import { CsvImportWay } from '../enums/';
import { CsvReaderNotImplementedException } from '@api/exceptions';
import { CsvPekaoReader, CsvPkoReader } from './csv-import/csv-readers';
import { CsvImporter } from './csv-import';

@Injectable()
export class OperationsImportService {
  private readonly csvReaderMap: { [key in CsvImportWay]: any };
  constructor(
    private readonly csvImporter: CsvImporter,
    private readonly csvPekaoReader: CsvPekaoReader,
    private readonly csvPkoReader: CsvPkoReader,
  ) {
    this.csvReaderMap = {
      PEKAO: csvPekaoReader,
      PKO: csvPkoReader,
    };
  }
  getSupportedCsvWays(): string[] {
    return Object.keys(CsvImportWay);
  }

  async import(
    filePath: string,
    userId: number,
    importOperationsDto: ImportOperationsDto,
  ) {
    const { csvImportWay } = importOperationsDto;
    const reader = this.csvReaderMap[csvImportWay];
    if (!reader) {
      throw new CsvReaderNotImplementedException(csvImportWay);
    }

    this.csvImporter.setReader(reader);

    this.csvImporter.import(filePath, userId);
  }
}
