import { CsvImportWay } from '@app/common/enums';

export interface OperationsImportPayload {
  url: string;
  userId: number;
  csvImportWay: CsvImportWay;
}
