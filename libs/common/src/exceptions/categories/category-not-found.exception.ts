import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  constructor(categoryIdentifier: number | string) {
    if (typeof categoryIdentifier === 'string') {
      super(`Category '${categoryIdentifier}' not found`);
    } else {
      super(`Category with id: '${categoryIdentifier}' not found`);
    }
  }
}
