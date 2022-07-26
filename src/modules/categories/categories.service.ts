import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';
import Category from '../../database/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { OperationsCategoriesService } from '../operations-categories/operations-categories.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepository: Repository<Category>,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    await this.validateNameUniqueness(createCategoryDto.name);

    return await this.categoryRepository.save({
      ...createCategoryDto,
      userId: this.request.user.id,
    });
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { userId: this.request.user.id },
    });
  }
  //
  // findOne(id: number): Promise<Category> {
  //   return `This action returns a #${id} category`;
  // }
  //
  // update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
  //   return `This action updates a #${id} category`;
  // }
  //

  //   if (!category) {
  //     throw new HttpException(
  //       'Category not found',
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }
  //
  //   await this.categoryRepository.delete({ id });
  //
  //   return true;
  // }

  private async validateNameUniqueness(name: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { userId: this.request.user.id, name },
    });

    if (category) {
      throw new HttpException(
        `Category with name: '${name}' already exists`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async findCategoryByName(name: string) {
    return await this.categoryRepository.findOne({
      where: { name, userId: this.request.user.id },
    });
  }

  async findCategoryById(categoryId: number): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { id: categoryId, userId: this.request.user.id },
    });
  }
}
