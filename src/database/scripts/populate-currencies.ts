import { CURRENCIES } from '../../constants/currencies';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import dataSource from '../../../config/data-source';
import Currency from '../entities/currency.entity';
import User from '../entities/user.entity';

ConfigModule.forRoot();

const populateCurrencies = async () => {
  for (const currency of CURRENCIES) {
    // const currencyRepository = dataSource.getRepository(User);
    // console.log(currency);
    // const currency1 = currencyRepository.find({
    //   where: { name: currency.name },
    // });
    // const currency1 = currencyRepository.find();
    // const currencyRepository = await dataSource.getRepository(Currency);
  }
};

populateCurrencies();
