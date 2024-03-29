import { Prisma, Category, CategoryType } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return await this.prisma.category.create({ data });
  }

  async findById(categoryId: number, userId: number): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });
  }

  async findByName(
    categoryName: string,
    userId: number,
  ): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        name: categoryName,
        userId,
      },
    });
  }

  async findByNameAndType(
    categoryName: string,
    categoryType: CategoryType,
    userId: number,
  ): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        name: categoryName,
        type: categoryType,
        userId,
      },
    });
  }

  async findAll(userId: number): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: { userId },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(
    id: number,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return await this.prisma.category.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(categoryId: number): Promise<Category> {
    return await this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
