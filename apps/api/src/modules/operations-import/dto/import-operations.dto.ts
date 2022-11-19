import { IsEnum } from 'class-validator';
import { CsvImportWay } from '@app/common/enums';

export class ImportOperationsDto {
  @IsEnum(CsvImportWay)
  csvImportWay: CsvImportWay;
}
