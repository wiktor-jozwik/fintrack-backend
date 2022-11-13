import { ApiProperty } from '@nestjs/swagger';

export class CurrencyRateValueOnDateResponse {
  @ApiProperty()
  date: string;

  @ApiProperty()
  value: number;
}
