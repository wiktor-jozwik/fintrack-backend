import { Request } from 'express';
import { UserPayloadInterface } from './user-payload.interface';

export interface AuthRequest extends Request {
  user: UserPayloadInterface;
}
