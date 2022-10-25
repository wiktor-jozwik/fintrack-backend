import { CsvImportWay } from '../enums/csv-import-way.enum';
import { IsEnum } from 'class-validator';

export class ImportOperationsDto {
  @IsEnum(CsvImportWay)
  csvImportWay: CsvImportWay;
}
