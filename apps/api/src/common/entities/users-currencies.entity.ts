import { UsersCurrencies } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UsersCurrenciesEntity implements UsersCurrencies {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  currencyId: number;

  @ApiProperty()
  userId: number;
}
