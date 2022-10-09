import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { CategoryNotFoundException } from './exceptions/category-not-found.exception';
import { CategoryExistsException } from './exceptions/category-exists.exception';
import { OperationAssignedException } from './exceptions/operation-assigned.exception';
import { CategoriesRepository } from './categories.repository';
import { OperationsRepository } from '../operations/operations/operations.repository';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType } from '../../common/enums/category-type.enum';

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
