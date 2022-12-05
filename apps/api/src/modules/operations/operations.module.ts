import { CacheModule, Module } from '@nestjs/common';
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
  OperationsValidatorService,
} from './services';
import { CategoriesValidatorService } from '../categories/services';
import { UsersCurrenciesValidatorService } from '../users-currencies/services';

@Module({
  imports: [
    CacheModule.register({
      max: 10000,
    }),
  ],
  controllers: [OperationsController],
  providers: [
    DefaultCurrencyOperationCalculatorService,
    OperationsService,
    OperationsValidatorService,
    CategoriesValidatorService,
    UsersCurrenciesValidatorService,
    OperationsRepository,
    CategoriesRepository,
    CurrencyRatesRepository,
    UsersCurrenciesRepository,
  ],
  exports: [OperationsService],
})
export class OperationsModule {}
