import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { CategoryNotFoundException } from './exceptions/category-not-found.exception';
import { CategoryExistsException } from './exceptions/category-exists.exception';
import { OperationAssignedException } from './exceptions/operation-assigned.exception';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    await this.validateNameUniqueness(userId, createCategoryDto.name);

    return await this.prisma.category.create({
      data: {
        ...createCategoryDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId: number): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: { userId },
    });
  }

  async remove(userId: number, categoryId: number): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      throw new CategoryNotFoundException(categoryId);
    }

    await this.validateZeroOperations(categoryId);

    return await this.prisma.category.delete({ where: { id: categoryId } });
  }

  async validateNameUniqueness(userId: number, name: string): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: {
        userId,
        name,
      },
    });

    if (category) {
      throw new CategoryExistsException(name);
    }
  }

  private async validateZeroOperations(categoryId: number): Promise<void> {
    const operationsNumber = await this.prisma.operation.count({
      where: {
        categoryId,
      },
    });

    if (operationsNumber > 0) {
      throw new OperationAssignedException(categoryId);
    }
  }
}
