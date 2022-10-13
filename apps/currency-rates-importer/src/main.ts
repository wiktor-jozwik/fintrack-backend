import { NestFactory } from '@nestjs/core';
import { CurrencyRatesImporterModule } from './currency-rates-importer.module';

async function bootstrap() {
  const app = await NestFactory.create(CurrencyRatesImporterModule);
  await app.listen(3001);
}
bootstrap();
