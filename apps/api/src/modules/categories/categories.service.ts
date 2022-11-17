import { Injectable } from '@nestjs/common';
import { Category, CategoryType } from '@prisma/client';
import { CategoriesRepository, OperationsRepository } from '@app/database';
import {
  CategoryExistsException,
  CategoryNotFoundException,
  OperationAssignedException,
} from '@app/common/exceptions';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

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
    const { name, type } = createCategoryDto;
    await this.validateNameUniqueness(name, type, userId);

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

  async update(
    updateCategoryDto: UpdateCategoryDto,
    categoryId: number,
    userId: number,
  ): Promise<Category> {
    const category = await this.validateCategoryPresence(categoryId, userId);

    await this.validateIfFieldsChanged(
      category,
      updateCategoryDto.name,
      updateCategoryDto.type,
      userId,
    );

    return await this.categoriesRepository.update(
      categoryId,
      updateCategoryDto,
    );
  }

  async remove(categoryId: number, userId: number): Promise<Category> {
    await Promise.all([
      this.validateCategoryPresence(categoryId, userId),
      this.validateZeroOperations(categoryId),
    ]);

    return await this.categoriesRepository.delete(categoryId);
  }

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

  private async validateCategoryPresence(
    categoryId: number,
    userId: number,
  ): Promise<Category> {
    const category = await this.categoriesRepository.findById(
      categoryId,
      userId,
    );

    if (!category) {
      throw new CategoryNotFoundException(categoryId);
    }

    return category;
  }

  private async validateZeroOperations(categoryId: number): Promise<void> {
    const operations = await this.operationsRepository.findManyByCategoryId(
      categoryId,
    );

    if (operations.length > 0) {
      throw new OperationAssignedException(operations[0].category.name);
    }
  }

  private async validateIfFieldsChanged(
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
}
