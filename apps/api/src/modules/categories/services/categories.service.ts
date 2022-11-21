import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoriesRepository } from '@app/database';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { CategoriesValidatorService } from '@app/api/src/modules/categories/services/categories-validator.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRequestValidatorService: CategoriesValidatorService,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const { name, type } = createCategoryDto;

    await this.categoriesRequestValidatorService.validateNameUniqueness(
      name,
      type,
      userId,
    );

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
    const category =
      await this.categoriesRequestValidatorService.findAndValidateCategory(
        categoryId,
        userId,
      );

    await this.categoriesRequestValidatorService.validateIfFieldsChanged(
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
      this.categoriesRequestValidatorService.findAndValidateCategory(
        categoryId,
        userId,
      ),
      this.categoriesRequestValidatorService.validateZeroOperations(categoryId),
    ]);

    return await this.categoriesRepository.delete(categoryId);
  }
}
