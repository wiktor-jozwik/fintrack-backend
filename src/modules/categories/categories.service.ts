import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

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
      throw new NotFoundException('Category not found');
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
      throw new HttpException(
        `Category with name: '${name}' already exists`,
        HttpStatus.CONFLICT,
      );
    }
  }

  private async validateZeroOperations(categoryId: number): Promise<void> {
    const operationsNumber = await this.prisma.operation.count({
      where: {
        categoryId,
      },
    });

    if (operationsNumber > 0) {
      throw new HttpException(
        'Category has operations assigned and cannot be deleted!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
