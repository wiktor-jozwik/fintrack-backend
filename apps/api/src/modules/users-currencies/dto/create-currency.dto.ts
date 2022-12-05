import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
