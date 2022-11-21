import { Module } from '@nestjs/common';
import { CategoriesService, CategoriesValidatorService } from './services';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository, OperationsRepository } from '@app/database';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesValidatorService,
    CategoriesRepository,
    OperationsRepository,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
