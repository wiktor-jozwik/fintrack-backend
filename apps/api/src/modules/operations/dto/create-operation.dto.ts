import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateOperationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  moneyAmount: number;

  @IsDateString()
  date: Date;

  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  currencyName: string;
}
