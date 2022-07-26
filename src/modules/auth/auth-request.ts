import { Request } from 'express';
import { UserPayloadInterface } from './strategies/user.payload.interface';

export interface AuthRequest extends Request {
  user: UserPayloadInterface;
}
