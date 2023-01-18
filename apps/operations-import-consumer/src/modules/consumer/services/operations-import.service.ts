import { Injectable, Logger } from '@nestjs/common';
import { CsvReader, CsvReaderCreator } from './csv-import/csv-readers';
import { CsvImporter } from './csv-import';
import { CsvReaderNotImplementedException } from '@app/common/exceptions';
import { CsvImportWay } from '@app/common/enums';
import { OperationsImportPayload } from '@app/common/interfaces';
import { AzureBlobStorageService } from '@app/azure-blob-storage';

@Injectable()
export class OperationsImportService {
  private readonly logger = new Logger(OperationsImportService.name);

  constructor(
    private readonly azureBlobStorageService: AzureBlobStorageService,
    private readonly csvImporter: CsvImporter,
    private readonly csvReaderCreator: CsvReaderCreator,
  ) {}

  async processImport(payload: OperationsImportPayload): Promise<void> {
    const { fileName, userId, csvImportWay } = payload;

    this.logger.log(
      `Consuming operation import for user: ${userId} with fileName: ${fileName}`,
    );

    const directory = 'upload';
    const filePath = `${directory}/${fileName}`;

    await this.azureBlobStorageService.downloadFile(directory, fileName);
    await this.importOperations(filePath, userId, csvImportWay);
  }

  private async importOperations(
    filePath: string,
    userId: number,
    csvImportWay: CsvImportWay,
  ): Promise<void> {
    const reader: CsvReader = this.csvReaderCreator.create(csvImportWay);
    if (!reader) {
      throw new CsvReaderNotImplementedException(csvImportWay);
    }

    this.csvImporter.setReader(reader);

    this.csvImporter.import(filePath, userId);
  }
}
