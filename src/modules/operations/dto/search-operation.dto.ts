import { IsDateString, IsOptional } from 'class-validator';

export class SearchOperationDto {
  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;
}
