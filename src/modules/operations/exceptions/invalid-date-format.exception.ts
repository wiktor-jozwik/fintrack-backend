import { UnprocessableEntityException } from '@nestjs/common';

export class InvalidDateFormatException extends UnprocessableEntityException {
  constructor() {
    super(`Provided date was invalid. Provide date in YYYY-MM-DD format`);
  }
}
