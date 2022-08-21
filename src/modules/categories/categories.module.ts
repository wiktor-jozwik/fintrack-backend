import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { OperationsRepository } from '../operations/operations.repository';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, OperationsRepository],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
