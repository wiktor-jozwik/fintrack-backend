import { Module } from '@nestjs/common';
import { CurrencyRatesService } from './currency-rates.service';
import { CurrencyRatesController } from './currency-rates.controller';
import { CurrencyRatesRepository } from '@app/database';

@Module({
  providers: [CurrencyRatesService, CurrencyRatesRepository],
  controllers: [CurrencyRatesController],
})
export class CurrencyRatesModule {}
