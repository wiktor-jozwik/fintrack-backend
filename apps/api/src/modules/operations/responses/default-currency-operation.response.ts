import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../../../common/entities';

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
