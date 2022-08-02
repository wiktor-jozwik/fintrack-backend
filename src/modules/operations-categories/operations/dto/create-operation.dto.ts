import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOperationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  moneyAmount: number;

  @IsDateString()
  date: Date;

  @IsString()
  categoryName: string;
}
