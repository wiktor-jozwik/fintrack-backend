import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll(userId: number): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: { userId },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return await this.prisma.category.create({ data });
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
