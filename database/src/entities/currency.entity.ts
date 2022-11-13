import { Currency } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CurrencyEntity implements Currency {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;
}
