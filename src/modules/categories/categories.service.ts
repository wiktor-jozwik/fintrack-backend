import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    await this.validateNameUniqueness(createCategoryDto.name);

    return await this.prisma.category.create({
      data: {
        ...createCategoryDto,
        user: {
          connect: {
            id: this.request.user.id,
          },
        },
      },
    });
  }

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: { userId: this.request.user.id },
    });
  }

  async remove(id: number): Promise<Category> {
    await this.validateZeroOperations(id);

    const category = await this.prisma.category.findFirst({
      where: { id, userId: this.request.user.id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return await this.prisma.category.delete({ where: { id } });
  }

  async validateNameUniqueness(name: string): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: {
        userId: this.request.user.id,
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
