import { Currency, User } from '@prisma/client';

export interface UserProfileResponse {
  defaultCurrency: Partial<Currency>;
  user: Partial<User>;
}
