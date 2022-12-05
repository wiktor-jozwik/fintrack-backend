import { CategoryType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsBoolean()
  isInternal: boolean;
}
