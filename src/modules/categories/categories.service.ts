import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { CategoryNotFoundException } from './exceptions/category-not-found.exception';
import { CategoryExistsException } from './exceptions/category-exists.exception';
import { OperationAssignedException } from './exceptions/operation-assigned.exception';
import { CategoriesRepository } from './categories.repository';
import { OperationsRepository } from '../operations/operations.repository';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly operationsRepository: OperationsRepository,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    await this.validateNameUniqueness(createCategoryDto.name, userId);

    return await this.categoriesRepository.create({
      ...createCategoryDto,
      user: {
        connect: {
          id: userId,
        },
      },
    });
  }

  async findAll(userId: number): Promise<Category[]> {
    return await this.categoriesRepository.findAll(userId);
  }

  async remove(categoryId: number, userId: number): Promise<Category> {
    const category = this.categoriesRepository.findById(categoryId, userId);

    if (!category) {
      throw new CategoryNotFoundException(categoryId);
    }

    await this.validateZeroOperations(categoryId);

    return this.categoriesRepository.delete(categoryId);
  }

  async validateNameUniqueness(name: string, userId: number): Promise<void> {
    const category = await this.categoriesRepository.findByName(name, userId);

    if (category) {
      throw new CategoryExistsException(name);
    }
  }

  private async validateZeroOperations(categoryId: number): Promise<void> {
    const operations = await this.operationsRepository.findManyByCategoryId(
      categoryId,
    );

    if (operations.length > 0) {
      throw new OperationAssignedException(operations[0].name);
    }
  }
}
