import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesRepository } from './currencies.repository';

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService, CurrenciesRepository],
  exports: [CurrenciesService, CurrenciesRepository],
})
export class CurrenciesModule {}
