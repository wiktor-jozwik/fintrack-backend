import { Inject, Injectable } from '@nestjs/common';
import { OPERATIONS_IMPORT_SERVICE } from './constants/operations-import-service';
import { ClientProxy } from '@nestjs/microservices';
import { CsvImportWay } from '@app/common/enums';
import { OperationsImportPayload } from '@app/common/interfaces';

@Injectable()
export class OperationsImportService {
  constructor(
    @Inject(OPERATIONS_IMPORT_SERVICE)
    private readonly importClient: ClientProxy,
  ) {}

  getSupportedCsvWays(): string[] {
    return Object.keys(CsvImportWay);
  }

  queueOperationsImportFile(payload: OperationsImportPayload) {
    this.importClient.emit('import-operations', payload);
  }
}
