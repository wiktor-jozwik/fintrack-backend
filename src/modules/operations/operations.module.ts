import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OperationsController } from './operations.controller';

@Module({
  imports: [PrismaModule],
  providers: [OperationsService],
  exports: [OperationsService],
  controllers: [OperationsController],
})
export class OperationsModule {}
