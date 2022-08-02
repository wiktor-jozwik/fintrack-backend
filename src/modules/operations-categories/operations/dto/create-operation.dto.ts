import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
