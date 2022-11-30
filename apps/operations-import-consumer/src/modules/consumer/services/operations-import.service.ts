import { Injectable, Logger } from '@nestjs/common';
import { CsvReader } from './csv-import/csv-readers';
import { CsvImporter } from './csv-import';
import { CsvReaderNotImplementedException } from '@app/common/exceptions';
import { CsvImportWay } from '@app/common/enums';
import { CsvReaderCreator } from './csv-import/csv-readers/csv-reader-creator';
import { OperationsImportPayload } from '@app/common/interfaces';
import * as fs from 'fs';
import { AzureBlobStorageService } from '@app/azure-blob-storage';

@Injectable()
export class OperationsImportService {
  private readonly logger = new Logger(OperationsImportService.name);

  constructor(
    private readonly azureBlobStorageService: AzureBlobStorageService,
    private readonly csvImporter: CsvImporter,
    private readonly csvReaderCreator: CsvReaderCreator,
  ) {}

  async processImport(payload: OperationsImportPayload) {
    const { fileName, userId, csvImportWay } = payload;

    this.logger.log(
      `Consuming operation import for user: ${userId} with fileName: ${fileName}`,
    );

    const directory = 'upload';
    const filePath = `${directory}/${fileName}`;

    await this.azureBlobStorageService.downloadFile(directory, fileName);
    await this.importOperations(filePath, userId, csvImportWay);
    await this.azureBlobStorageService.deleteFile(fileName);
    fs.unlinkSync(filePath);
  }

  private async importOperations(
    filePath: string,
    userId: number,
    csvImportWay: CsvImportWay,
  ) {
    const reader: CsvReader = this.csvReaderCreator.create(csvImportWay);
    if (!reader) {
      throw new CsvReaderNotImplementedException(csvImportWay);
    }

    this.csvImporter.setReader(reader);

    this.csvImporter.import(filePath, userId);
  }
}
