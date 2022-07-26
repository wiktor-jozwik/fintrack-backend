import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Category from '../../database/entities/category.entity';
import { OperationsService } from '../operations/operations.service';
import Operation from '../../database/entities/operation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Operation])],
  controllers: [CategoriesController],
  providers: [CategoriesService, OperationsService],
})
export class CategoriesModule {}
