import { NotFoundException } from '@nestjs/common';

export class OperationNotFoundException extends NotFoundException {
  constructor(operationId: number) {
    super(`Operation with id: '${operationId}' not found`);
  }
}
