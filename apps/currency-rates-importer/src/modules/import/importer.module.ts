import { Module } from '@nestjs/common';
import { ImportService } from './domain/import.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import CurrencyFetchService from './domain/currency-fetch.service';
import NbpHttpService from './domain/nbp-http.service';
import { CurrencyRatesRepository } from '@app/database';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  providers: [
    ImportService,
    CurrencyFetchService,
    NbpHttpService,
    CurrencyRatesRepository,
  ],
})
export class ImporterModule {}
