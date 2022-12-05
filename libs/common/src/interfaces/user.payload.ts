import { UserEmailPayload } from './user-email.payload';

export interface UserPayload extends UserEmailPayload {
  isActive: boolean;
}
