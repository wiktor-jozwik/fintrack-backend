import { Module } from '@nestjs/common';
import { OperationsImportController } from './operations-import.controller';
import {
  CategoriesRepository,
  CurrencyRatesRepository,
  OperationsRepository,
  UsersCurrenciesRepository,
  UsersRepository,
} from '@app/database';
import { OperationsImportService } from '@api/modules/operations/operations-import/domain';
import { CsvImporter, OperationsImportSaveService } from './domain/csv-import';
import { CsvPekaoReader, CsvPkoReader } from './domain/csv-import/csv-readers';

@Module({
  providers: [
    UsersRepository,
    OperationsRepository,
    CategoriesRepository,
    UsersCurrenciesRepository,
    CurrencyRatesRepository,
    OperationsImportService,
    CsvImporter,
    OperationsImportSaveService,
    CsvPekaoReader,
    CsvPkoReader,
  ],
  controllers: [OperationsImportController],
})
export class OperationsImportModule {}
