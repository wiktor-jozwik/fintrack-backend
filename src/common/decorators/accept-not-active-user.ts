import { SetMetadata } from '@nestjs/common';

export const ACCEPT_NOT_ACTIVE_USER_KEY = 'acceptNotActiveUser';
export const AcceptNotActiveUser = () =>
  SetMetadata(ACCEPT_NOT_ACTIVE_USER_KEY, true);
