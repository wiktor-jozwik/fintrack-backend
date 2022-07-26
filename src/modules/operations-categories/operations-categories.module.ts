import { Module } from '@nestjs/common';
import { OperationsModule } from '../operations/operations.module';
import { CategoriesModule } from '../categories/categories.module';
import { OperationsCategoriesService } from './operations-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Category from '../../database/entities/category.entity';
import Operation from '../../database/entities/operation.entity';

@Module({
  imports: [
    OperationsModule,
    CategoriesModule,
    TypeOrmModule.forFeature([Category, Operation]),
  ],
  providers: [OperationsCategoriesService],
})
export class OperationsCategoriesModule {}
