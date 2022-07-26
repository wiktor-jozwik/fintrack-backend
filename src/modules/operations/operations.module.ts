import { forwardRef, Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Operation from '../../database/entities/operation.entity';
import Category from '../../database/entities/category.entity';
import { CategoriesModule } from '../categories/categories.module';
import { OperationsCategoriesModule } from '../operations-categories/operations-categories.module';
import { OperationsCategoriesService } from '../operations-categories/operations-categories.service';

@Module({
  // imports: [TypeOrmModule.forFeature([Operation, Category])],
  controllers: [OperationsController],
  providers: [OperationsCategoriesService],
})
export class OperationsModule {}
