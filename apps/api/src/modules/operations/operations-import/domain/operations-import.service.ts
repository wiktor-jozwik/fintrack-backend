import { Injectable } from '@nestjs/common';
import { ImportOperationsDto } from '../dto/import-operations.dto';
import { CsvImportWay } from '../enums/csv-import-way.enum';
import CsvPkoReader from './csv-import/csv-readers/pl-banks/csv-pko.reader';
import { CsvReaderNotImplementedException } from '../exceptions/csv-reader-not-implemented.exception';
import CsvPekaoReader from './csv-import/csv-readers/pl-banks/csv-pekao-reader';
import CsvImporter from './csv-import/csv-importer';
import CsvIngReader from './csv-import/csv-readers/pl-banks/csv-ing-reader';

@Injectable()
export class OperationsImportService {
  private readonly csvReaderMap: { [key in CsvImportWay]: any };
  constructor(
    private readonly csvImporter: CsvImporter,
    private readonly csvPekaoReader: CsvPekaoReader,
    private readonly csvPkoReader: CsvPkoReader,
    private readonly csvIngReader: CsvIngReader,
  ) {
    this.csvReaderMap = {
      ING: csvIngReader,
      MBANK: undefined,
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
