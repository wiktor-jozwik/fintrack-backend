import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsBoolean()
  isInternal: boolean;
}
