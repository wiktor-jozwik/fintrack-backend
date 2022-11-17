import { Module } from '@nestjs/common';
import {
  CategoriesRepository,
  CurrencyRatesRepository,
  OperationsRepository,
  PrismaModule,
  UsersCurrenciesRepository,
  UsersRepository,
} from '@app/database';
import { CsvImporter, OperationsImportSaveService } from './domain/csv-import';
import { CsvPekaoReader, CsvPkoReader } from './domain/csv-import/csv-readers';
import { OperationsImportHandlerController } from './operations-import-handler.controller';
import { OperationsImportService } from './domain';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessTokenGuard, UserIsActiveGuard } from '@app/common/guards';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtAccessTokenStrategy } from '@app/api/src/modules/auth/strategies';
import { CsvReaderCreator } from './domain/csv-import/csv-readers/csv-reader-creator';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('test', 'development', 'staging', 'production')
          .default('development'),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        OPERATION_IMPORT_HANDLER_PORT: Joi.number().required(),
      }),
    }),
  ],
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
    JwtAccessTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserIsActiveGuard,
    },
  ],
  controllers: [OperationsImportHandlerController],
})
export class OperationsImportHandlerModule {}
