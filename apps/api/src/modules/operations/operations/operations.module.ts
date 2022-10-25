import { Module } from '@nestjs/common';
import { OperationsController } from './operations.controller';
import {
  CategoriesRepository,
  CurrencyRatesRepository,
  OperationsRepository,
  UsersCurrenciesRepository,
} from '@app/database';
import {
  DefaultCurrencyOperationCalculatorService,
  OperationsService,
} from './domain';

@Module({
  controllers: [OperationsController],
  providers: [
    DefaultCurrencyOperationCalculatorService,
    OperationsService,
    OperationsRepository,
    CategoriesRepository,
    CurrencyRatesRepository,
    UsersCurrenciesRepository,
  ],
  exports: [OperationsService],
})
export class OperationsModule {}
