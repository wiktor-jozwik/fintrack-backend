import { CsvImportWay } from '@app/common/enums';

export interface OperationsImportPayload {
  fileName: string;
  userId: number;
  csvImportWay: CsvImportWay;
}
