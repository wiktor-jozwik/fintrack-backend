import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoriesRepository } from '@app/database';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { CategoriesValidatorService } from './categories-validator.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesValidatorService: CategoriesValidatorService,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const { name, type } = createCategoryDto;

    await this.categoriesValidatorService.validateNameUniqueness(
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
      await this.categoriesValidatorService.findAndValidateCategory(
        categoryId,
        userId,
      );

    await this.categoriesValidatorService.validateIfFieldsChanged(
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
      this.categoriesValidatorService.findAndValidateCategory(
        categoryId,
        userId,
      ),
      this.categoriesValidatorService.validateZeroOperations(categoryId),
    ]);

    return await this.categoriesRepository.delete(categoryId);
  }
}
