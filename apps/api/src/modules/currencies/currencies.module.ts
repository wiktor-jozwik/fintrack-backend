import { Module } from '@nestjs/common';
import { CurrenciesService, CurrenciesValidatorService } from './services';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesRepository } from '@app/database';

@Module({
  controllers: [CurrenciesController],
  providers: [
    CurrenciesService,
    CurrenciesRepository,
    CurrenciesValidatorService,
  ],
  exports: [CurrenciesService, CurrenciesValidatorService],
})
export class CurrenciesModule {}
