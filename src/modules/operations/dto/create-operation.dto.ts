import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOperationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  moneyAmount: number;

  @IsDate()
  date: Date;

  @IsString()
  categoryName: string;
}
