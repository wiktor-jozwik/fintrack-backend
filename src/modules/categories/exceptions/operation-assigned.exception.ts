import { UnprocessableEntityException } from '@nestjs/common';

export class OperationAssignedException extends UnprocessableEntityException {
  constructor(categoryId: number) {
    super(
      `Category with id '${categoryId}' has operations assigned and cannot be deleted!`,
    );
  }
}
