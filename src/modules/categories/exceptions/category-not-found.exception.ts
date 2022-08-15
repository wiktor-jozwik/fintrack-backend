import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  constructor(categoryId?: number, categoryName?: string) {
    if (categoryId) {
      super(`Category with id: '${categoryId}' not found`);
    } else if (categoryName) {
      super(`Category '${categoryName}' not found`);
    }
  }
}
