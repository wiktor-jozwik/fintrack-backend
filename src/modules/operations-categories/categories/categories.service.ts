import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../../auth/auth-request';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    await this.validateNameUniqueness(createCategoryDto.name);

    const data: Prisma.CategoryCreateInput = {
      ...createCategoryDto,
      user: {
        connect: {
          id: this.request.user.id,
        },
      },
    };

    return await this.prisma.category.create({ data });
  }

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: { userId: this.request.user.id },
    });
  }

  async remove(id: number): Promise<boolean> {
    const category = await this.prisma.category.findFirst({
      where: { id, userId: this.request.user.id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    try {
      await this.prisma.category.delete({ where: { id } });
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
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
}
