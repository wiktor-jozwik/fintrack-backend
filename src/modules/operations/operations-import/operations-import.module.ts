import { Module } from '@nestjs/common';
import { OperationsImportService } from './domain/operations-import.service';
import { OperationsImportController } from './operations-import.controller';
import CsvPekaoReader from './domain/csv-import/csv-readers/pl-banks/csv-pekao-reader';
import { UsersRepository } from '../../users/users.repository';
import { OperationsRepository } from '../operations/operations.repository';
import { CategoriesRepository } from '../../categories/categories.repository';
import CsvPkoReader from './domain/csv-import/csv-readers/pl-banks/csv-pko.reader';
import CsvImporter from './domain/csv-import/csv-importer';
import CsvIngReader from './domain/csv-import/csv-readers/pl-banks/csv-ing-reader';
import OperationsImportSaveService from './domain/csv-import/operations-import-save.service';
import { UsersCurrenciesRepository } from '../../users-currencies/users-currencies.repository';

@Module({
  providers: [
    UsersRepository,
    OperationsRepository,
    CategoriesRepository,
    UsersCurrenciesRepository,
    OperationsImportService,
    CsvImporter,
    OperationsImportSaveService,
    CsvPekaoReader,
    CsvPkoReader,
    CsvIngReader,
  ],
  controllers: [OperationsImportController],
})
export class OperationsImportModule {}
