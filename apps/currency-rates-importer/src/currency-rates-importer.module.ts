import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ImporterModule } from './modules/import/importer.module';

@Module({
  imports: [PrismaModule, ImporterModule],
})
export class CurrencyRatesImporterModule {}
