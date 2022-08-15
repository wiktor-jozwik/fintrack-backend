import { NotFoundException } from '@nestjs/common';

export class DefaultCurrencyNotFoundException extends NotFoundException {
  constructor() {
    super(`Default currency not found`);
  }
}
