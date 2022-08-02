import { Module } from '@nestjs/common';
import { OperationsModule } from './operations/operations.module';
import { CategoriesModule } from './categories/categories.module';
import { OperationsCategoriesService } from './operations-categories.service';
import { OperationsController } from './operations/operations.controller';
import { CategoriesController } from './categories/categories.controller';

@Module({
  imports: [OperationsModule, CategoriesModule],
  controllers: [OperationsController, CategoriesController],
  providers: [OperationsCategoriesService],
})
export class OperationsCategoriesModule {}