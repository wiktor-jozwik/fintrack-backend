import { Module } from '@nestjs/common';
import { CurrencyRatesImporterService } from './currency-rates-importer.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CurrencyRatesImporterService],
})
export class CurrencyRatesImporterModule {}
