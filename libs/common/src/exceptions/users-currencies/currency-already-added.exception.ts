import { ConflictException } from '@nestjs/common';

export class CurrencyAlreadyAddedException extends ConflictException {
  constructor(name: string) {
    super(`Currency '${name}' already added`);
  }
}
