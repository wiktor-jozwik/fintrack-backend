import { Module } from '@nestjs/common';
import { OperationsService } from './domain/operations.service';
import { OperationsController } from './operations.controller';
import { OperationsRepository } from './operations.repository';
import { CategoriesRepository } from '../../categories/categories.repository';
import { UsersCurrenciesRepository } from '../../users-currencies/users-currencies.repository';
import { DefaultCurrencyOperationCalculatorService } from './domain/default-currency-operation-calculator.service';
import CurrencyRatesRepository from '../../../database/repositories/currency-rates.repository';

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
  exports: [OperationsService, OperationsRepository],
})
export class OperationsModule {}
