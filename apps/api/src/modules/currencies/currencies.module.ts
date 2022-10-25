import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesRepository } from '@app/database';

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService, CurrenciesRepository],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
