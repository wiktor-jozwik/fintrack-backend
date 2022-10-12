import { UnprocessableEntityException } from '@nestjs/common';

export class OperationAssignedException extends UnprocessableEntityException {
  constructor(categoryName: string) {
    super(
      `Category '${categoryName}' has operations assigned and cannot be deleted!`,
    );
  }
}
