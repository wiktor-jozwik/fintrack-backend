import { BadRequestException } from '@nestjs/common';

export class InvalidRefreshTokenException extends BadRequestException {
  constructor() {
    super('Refresh token malformed');
  }
}
