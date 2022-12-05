import { Module } from '@nestjs/common';
import {
  UsersCurrenciesService,
  UsersCurrenciesValidatorService,
} from './services';
import { UsersCurrenciesController } from './users-currencies.controller';
import { CurrenciesRepository, UsersCurrenciesRepository } from '@app/database';
import { CurrenciesValidatorService } from '../currencies/services';

@Module({
  controllers: [UsersCurrenciesController],
  providers: [
    UsersCurrenciesService,
    UsersCurrenciesValidatorService,
    CurrenciesValidatorService,
    UsersCurrenciesRepository,
    CurrenciesRepository,
  ],
  exports: [UsersCurrenciesService],
})
export class UsersCurrenciesModule {}
