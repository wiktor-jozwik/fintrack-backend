import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity, CurrencyEntity, OperationEntity } from '@app/database';

export class OperationWithCurrencyCategoryResponse extends OperationEntity {
  @ApiProperty()
  currency: CurrencyEntity;

  @ApiProperty()
  category: CategoryEntity;
}
