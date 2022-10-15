import { Module } from '@nestjs/common';
import { OperationsCalculatorController } from './operations-calculator.controller';
import { OperationsCalculatorService } from './operations-calculator.service';
import CurrencyRatesRepository from '../../../database/repositories/currency-rates.repository';
import { OperationsRepository } from '../operations/operations.repository';
import { UsersCurrenciesRepository } from '../../users-currencies/users-currencies.repository';

@Module({
  controllers: [OperationsCalculatorController],
  providers: [
    OperationsCalculatorService,
    UsersCurrenciesRepository,
    OperationsRepository,
    CurrencyRatesRepository,
  ],
})
export class OperationsCalculatorModule {}
