import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEntity, UserEntity } from '@app/database';

export class UserProfileResponse {
  @ApiProperty()
  defaultCurrency: Partial<CurrencyEntity>;

  @ApiProperty()
  user: Partial<UserEntity>;
}
