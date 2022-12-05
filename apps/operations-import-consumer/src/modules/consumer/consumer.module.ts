import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { RmqService } from '@app/rmq';
import {
  CategoriesRepository,
  CurrencyRatesRepository,
  OperationsRepository,
  UsersCurrenciesRepository,
  UsersRepository,
} from '@app/database';
import { OperationsImportService } from './services';
import {
  CsvImporter,
  OperationsImportSaveService,
} from './services/csv-import';
import {
  CsvPekaoReader,
  CsvPkoReader,
  CsvReaderCreator,
} from './services/csv-import/csv-readers';
import { AzureBlobStorageModule } from '@app/azure-blob-storage';
import { ConfigService } from '@nestjs/config';
import { FilesystemService } from './services';

@Module({
  imports: [AzureBlobStorageModule],
  controllers: [ConsumerController],
  providers: [
    ConfigService,
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
    CsvReaderCreator,
    RmqService,
    FilesystemService,
  ],
})
export class ConsumerModule {}
