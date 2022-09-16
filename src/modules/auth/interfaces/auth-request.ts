import { Request } from 'express';
import { UserPayload } from './user.payload';

export interface AuthRequest extends Request {
  user: UserPayload;
}
