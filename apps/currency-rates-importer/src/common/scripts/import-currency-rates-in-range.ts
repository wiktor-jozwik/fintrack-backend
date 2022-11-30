import { NestFactory } from '@nestjs/core';
import { CurrencyRatesImporterModule } from '../../currency-rates-importer.module';
import { ImportService } from '../../modules/import/services';
import * as moment from 'moment';
import { SUPPORTED_CURRENCIES } from '@app/common/constants';

export const importCurrencyRatesInRange = async (
  currency?: string | undefined,
) => {
  const currencyArg = process.argv[2];
  const startDate = process.argv[3];
  const endDate = process.argv[4];

  const currencyToImport = currency || currencyArg;

  const supportedCurrencies = SUPPORTED_CURRENCIES.map((currency) => {
    return currency.name;
  });

  if (!supportedCurrencies.includes(currencyToImport)) {
    throw new Error(`'${currencyToImport}' not supported`);
  }

  let momentStartDate = moment(startDate);
  let momentEndDate = moment(endDate);

  if (!startDate) {
    momentStartDate = moment('2002-01-02');
  }

  if (!endDate) {
    momentEndDate = moment();
  }

  const app = await NestFactory.create(CurrencyRatesImporterModule);
  const importService = app.get<ImportService>(ImportService);

  await importService.importCurrencyRatesForDateRange(
    currencyToImport,
    momentStartDate,
    momentEndDate,
  );
};
