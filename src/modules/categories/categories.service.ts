import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';
import Category from '../../database/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(REQUEST) private request: AuthRequest,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // create(createCategoryDto: CreateCategoryDto): Promise<Category> {
  //   return 'This action adds a new category';
  // }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { id: this.request.user?.id },
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
  // remove(id: number): Promise<boolean> {
  //   return `This action removes a #${id} category`;
  // }
}
