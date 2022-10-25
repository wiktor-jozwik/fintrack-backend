import { Module } from '@nestjs/common';
import { OperationsService } from './domain/operations.service';
import { OperationsController } from './operations.controller';
import { DefaultCurrencyOperationCalculatorService } from './domain/default-currency-operation-calculator.service';
import {
  CategoriesRepository,
  CurrencyRatesRepository,
  OperationsRepository,
  UsersCurrenciesRepository,
} from '@app/database';

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
