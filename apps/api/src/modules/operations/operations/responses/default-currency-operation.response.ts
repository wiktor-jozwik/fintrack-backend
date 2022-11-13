import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '@app/database';

export class DefaultCurrencyOperationResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  moneyAmountInDefaultCurrency: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  category: CategoryEntity;
}
