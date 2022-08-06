import { SUPPORTED_CURRENCIES } from '../../constants/supported-currencies';
import { ConfigModule } from '@nestjs/config';
import dataSource from '../../config/data-source';
import Currency from '../entities/currency.entity';

ConfigModule.forRoot();

const populateCurrencies = async () => {
  await dataSource.initialize();
  const currencyRepository = await dataSource.getRepository(Currency);

  for (const currency of SUPPORTED_CURRENCIES) {
    const existingCurrency = await currencyRepository.findOne({
      where: { name: currency.name },
    });

    if (existingCurrency) {
      continue;
    }

    await currencyRepository.save(currency);
    console.log(`Saved ${currency.name}`);
  }
  await dataSource.destroy();
};

populateCurrencies();
