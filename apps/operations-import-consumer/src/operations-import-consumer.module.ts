import { Module } from '@nestjs/common';
import { OperationsImportConsumerController } from './operations-import-consumer.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqService } from '@app/rmq';
import {
  CategoriesRepository,
  CurrencyRatesRepository,
  OperationsRepository,
  PrismaModule,
  UsersCurrenciesRepository,
  UsersRepository,
} from '@app/database';
import { OperationsImportService } from './domain';
import { CsvImporter, OperationsImportSaveService } from './domain/csv-import';
import { CsvPekaoReader, CsvPkoReader } from './domain/csv-import/csv-readers';
import { CsvReaderCreator } from './domain/csv-import/csv-readers/csv-reader-creator';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        RABBITMQ_OPERATIONS_IMPORT_QUEUE: Joi.string().required(),
      }),
    }),
    PrismaModule,
  ],
  controllers: [OperationsImportConsumerController],
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
    CsvReaderCreator,
    RmqService,
  ],
})
export class OperationsImportConsumerModule {}
