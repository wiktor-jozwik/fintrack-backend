import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository, OperationsRepository } from '@app/database';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, OperationsRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
