import { Module } from '@nestjs/common';
import { UsersCurrenciesService } from './users-currencies.service';
import { UsersCurrenciesController } from './users-currencies.controller';
import { UsersCurrenciesRepository } from './users-currencies.repository';
import { CurrenciesRepository } from '../currencies/currencies.repository';

@Module({
  controllers: [UsersCurrenciesController],
  providers: [
    UsersCurrenciesService,
    UsersCurrenciesRepository,
    CurrenciesRepository,
  ],
  exports: [UsersCurrenciesService, UsersCurrenciesRepository],
})
export class UsersCurrenciesModule {}
