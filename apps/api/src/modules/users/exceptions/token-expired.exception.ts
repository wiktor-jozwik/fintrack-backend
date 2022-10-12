import { BadRequestException } from '@nestjs/common';

export class TokenExpiredException extends BadRequestException {
  constructor() {
    super('Token expired, try again');
  }
}
