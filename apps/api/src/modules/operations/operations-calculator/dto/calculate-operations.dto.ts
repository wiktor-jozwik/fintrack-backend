import { IsDateString, IsOptional } from 'class-validator';

export class CalculateOperationsDto {
  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;
}
