import { Injectable } from '@nestjs/common';
import { CsvPekaoReader, CsvPkoReader } from './pl-banks';
import { CsvImportWay } from '@app/common/enums';
import { CsvReader } from './csv-reader';

@Injectable()
export class CsvReaderCreator {
  private readonly csvReaderMap: { [key in CsvImportWay]: CsvReader };

  constructor(
    private readonly csvPekaoReader: CsvPekaoReader,
    private readonly csvPkoReader: CsvPkoReader,
  ) {
    this.csvReaderMap = {
      PEKAO: csvPekaoReader,
      PKO: csvPkoReader,
    };
  }

  create(csvImportWay: CsvImportWay): CsvReader {
    return this.csvReaderMap[csvImportWay];
  }
}
