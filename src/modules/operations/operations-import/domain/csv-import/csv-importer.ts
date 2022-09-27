import { OperationItem } from './interfaces/csv-operation-item';
import { CsvReader } from './csv-readers/csv-reader';
import { Injectable, Logger } from '@nestjs/common';
import OperationsImportSaveService from './operations-import-save.service';
import { SaveOperationItem } from './interfaces/save-operation-item';

@Injectable()
class CsvImporter {
  private readonly logger = new Logger(CsvImporter.name);
  private csvReader: CsvReader;

  constructor(
    private readonly csvOperationSaveService: OperationsImportSaveService,
  ) {}

  setReader(reader: CsvReader) {
    this.csvReader = reader;
  }

  import(filePath: string, userId: number) {
    this.csvReader.readCsv(filePath, (row) => this.saveOperation(row, userId));
  }

  async saveOperation(operation: OperationItem, userId: number) {
    const {
      referentialNumber,
      originName,
      isoDateString,
      absMoneyAmount,
      categoryType,
      operationName,
      currencyName,
      categoryName,
    } = operation;

    try {
      await this.csvOperationSaveService.validateUserExistence(userId);

      const currencyId = await this.csvOperationSaveService.findCurrency(
        currencyName,
        userId,
      );

      const categoryId = await this.csvOperationSaveService.saveOrFindCategory(
        categoryType,
        categoryName,
        userId,
      );

      const saveOperationItem: SaveOperationItem = {
        referentialNumber,
        originName,
        isoDateString,
        absMoneyAmount,
        operationName,
        userId,
        currencyId,
        categoryId,
      };

      const savedOperation = await this.csvOperationSaveService.saveOperation(
        saveOperationItem,
      );

      this.logger.log(
        `Saved operation: ${savedOperation.referentialNumber} with origin ${savedOperation.origin}`,
      );
    } catch (err) {
      this.logger.warn(err);
    }
  }
}

export default CsvImporter;
