import { Module } from '@nestjs/common';
import { ImporterModule } from './modules/import/importer.module';
import { PrismaModule } from '@app/database';

@Module({
  imports: [PrismaModule, ImporterModule],
})
export class CurrencyRatesImporterModule {}
