import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { OperationsRepository } from './operations.repository';
import { CategoriesRepository } from '../categories/categories.repository';
import { UsersCurrenciesRepository } from '../users-currencies/users-currencies.repository';

@Module({
  controllers: [OperationsController],
  providers: [
    OperationsService,
    OperationsRepository,
    CategoriesRepository,
    UsersCurrenciesRepository,
  ],
  exports: [OperationsService, OperationsRepository],
})
export class OperationsModule {}
