import { Module } from '@nestjs/common';
import { OperationsImportController } from './operations-import.controller';
import { OPERATIONS_IMPORT_SERVICE } from './constants';
import { RmqModule } from '@app/rmq';
import { OperationsImportService } from './services';

@Module({
  imports: [RmqModule.register({ name: OPERATIONS_IMPORT_SERVICE })],
  providers: [OperationsImportService],
  controllers: [OperationsImportController],
})
export class OperationsImportModule {}
