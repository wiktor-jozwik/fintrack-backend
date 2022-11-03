import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { comparisonOperators } from '@app/common/enums/comparison-operators';

export class SearchOperationDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(CategoryType)
  categoryType?: CategoryType;

  @IsOptional()
  @IsString()
  searchName?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isInternal?: boolean;

  @IsOptional()
  @IsIn(comparisonOperators)
  @IsString()
  operator?: typeof comparisonOperators[number];

  @IsOptional()
  @IsNumberString()
  moneyAmount?: number;
}
