import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEntity, UserEntity } from '../../../common/entities';

export class UserProfileResponse {
  @ApiProperty()
  defaultCurrency: Partial<CurrencyEntity>;

  @ApiProperty()
  user: Partial<UserEntity>;
}
