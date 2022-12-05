import { ApiProperty } from '@nestjs/swagger';
import {
  CategoryEntity,
  CurrencyEntity,
  OperationEntity,
} from '../../../common/entities';

export class OperationWithCurrencyCategoryResponse extends OperationEntity {
  @ApiProperty()
  currency: CurrencyEntity;

  @ApiProperty()
  category: CategoryEntity;
}
