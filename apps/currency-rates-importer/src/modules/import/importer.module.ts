import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { CurrenciesRepository, CurrencyRatesRepository } from '@app/database';
import { CurrencyFetchService, ImportService, NbpHttpService } from './domain';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  providers: [
    ImportService,
    CurrencyFetchService,
    NbpHttpService,
    CurrencyRatesRepository,
    CurrenciesRepository,
  ],
})
export class ImporterModule {}
