import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Operation from '../../../database/entities/operation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operation])],
  providers: [OperationsService],
  exports: [OperationsService],
})
export class OperationsModule {}
