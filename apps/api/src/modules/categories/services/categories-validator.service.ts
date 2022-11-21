import { Injectable } from '@nestjs/common';
import { Category, CategoryType } from '@prisma/client';
import {
  CategoryExistsException,
  CategoryNotFoundException,
  OperationAssignedException,
} from '@app/common/exceptions';
import { CategoriesRepository, OperationsRepository } from '@app/database';

@Injectable()
export class CategoriesValidatorService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly operationsRepository: OperationsRepository,
  ) {}

  async validateNameUniqueness(
    name: string,
    type: CategoryType,
    userId: number,
  ): Promise<void> {
    const category = await this.categoriesRepository.findByNameAndType(
      name,
      type,
      userId,
    );

    if (category) {
      throw new CategoryExistsException(name);
    }
  }

  async findAndValidateCategory(
    categoryIdentifier: number | string,
    userId: number,
  ): Promise<Category> {
    let category: Category | null;
    if (typeof categoryIdentifier === 'string') {
      category = await this.categoriesRepository.findByName(
        categoryIdentifier,
        userId,
      );
    } else {
      category = await this.categoriesRepository.findById(
        categoryIdentifier,
        userId,
      );
    }

    if (!category) {
      throw new CategoryNotFoundException(categoryIdentifier);
    }

    return category;
  }

  async validateIfFieldsChanged(
    category: Category,
    name: string | undefined,
    type: CategoryType | undefined,
    userId: number,
  ) {
    if (name && name !== category.name && type === category.type) {
      await this.validateNameUniqueness(
        name,
        CategoryType[category.type],
        userId,
      );
    } else if (type && type !== category.type && name === category.name) {
      await this.validateNameUniqueness(category.name, type, userId);
    } else if (
      type &&
      type !== category.type &&
      name &&
      category.name !== name
    ) {
      await this.validateNameUniqueness(name, type, userId);
    }
  }

  async validateZeroOperations(categoryId: number): Promise<void> {
    const operations = await this.operationsRepository.findManyByCategoryId(
      categoryId,
    );

    if (operations.length > 0) {
      throw new OperationAssignedException(operations[0].category.name);
    }
  }
}
