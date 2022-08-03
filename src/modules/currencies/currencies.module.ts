import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserCurrency from '../../database/entities/user-currency.entity';
import Currency from '../../database/entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCurrency, Currency])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
