import { SUPPORTED_CURRENCIES } from '../constants/supported-currencies';
import { NestFactory } from '@nestjs/core';
import { CurrencyRatesImporterModule } from '../../currency-rates-importer.module';
import { ImportService } from '../../modules/import/domain/import.service';
import * as moment from 'moment';

const importCurrencyRatesInRange = async () => {
  const currencyName = process.argv[2];
  const startDate = process.argv[3];
  const endDate = process.argv[4];

  const supportedCurrencies = SUPPORTED_CURRENCIES.map((currency) => {
    return currency.name;
  });

  if (!supportedCurrencies.includes(currencyName)) {
    throw new Error(`'${currencyName}' not supported`);
  }

  let momentStartDate = moment(startDate);
  let momentEndDate = moment(endDate);

  if (!startDate) {
    momentStartDate = moment('2002-01-02');
  }

  if (!endDate) {
    momentEndDate = moment();
  }

  console.log(momentStartDate);
  console.log(momentEndDate);

  const app = await NestFactory.create(CurrencyRatesImporterModule);
  const importService = app.get<ImportService>(ImportService);

  await importService.importCurrencyRatesForDateRange(
    currencyName,
    momentStartDate,
    momentEndDate,
  );
};

importCurrencyRatesInRange();
