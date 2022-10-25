import { Module } from '@nestjs/common';
import { UsersCurrenciesService } from './users-currencies.service';
import { UsersCurrenciesController } from './users-currencies.controller';
import { CurrenciesRepository, UsersCurrenciesRepository } from '@app/database';

@Module({
  controllers: [UsersCurrenciesController],
  providers: [
    UsersCurrenciesService,
    UsersCurrenciesRepository,
    CurrenciesRepository,
  ],
  exports: [UsersCurrenciesService],
})
export class UsersCurrenciesModule {}
