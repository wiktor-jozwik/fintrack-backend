import { Operation } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';

export class OperationEntity implements Operation {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  moneyAmount: Decimal;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  referentialNumber: string | null;

  @ApiProperty()
  origin: string | null;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  currencyId: number;
}
