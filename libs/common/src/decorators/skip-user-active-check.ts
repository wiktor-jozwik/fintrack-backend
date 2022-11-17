import { SetMetadata } from '@nestjs/common';

export const SKIP_USER_ACTIVE_CHECK = 'skipUserActiveCheck';
export const SkipUserActiveCheck = () =>
  SetMetadata(SKIP_USER_ACTIVE_CHECK, true);
