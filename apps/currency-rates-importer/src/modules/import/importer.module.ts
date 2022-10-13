import { Module } from '@nestjs/common';
import { ImportService } from './domain/import.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import CurrencyFetchService from './domain/currency-fetch.service';
import NbpHttpService from './domain/nbp-http.service';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  providers: [ImportService, CurrencyFetchService, NbpHttpService],
})
export class ImporterModule {}
