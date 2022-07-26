import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryTypeEnum } from '../../../enums/category-type.enum';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum;
}
