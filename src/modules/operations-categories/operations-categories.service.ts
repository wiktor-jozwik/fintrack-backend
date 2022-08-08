import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OperationsService } from './operations/operations.service';
import { CategoriesService } from './categories/categories.service';
import { CreateOperationDto } from './operations/dto/create-operation.dto';
import { CreateCategoryDto } from './categories/dto/create-category.dto';
import { Category, Currency, Operation, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';

@Injectable()
export class OperationsCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly operationsService: OperationsService,
    private readonly categoriesService: CategoriesService,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}

  async findAllOperations() {
    return await this.operationsService.findAll();
  }

  async createOperation(
    createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    const category = await this.findCategoryByName(
      createOperationDto.categoryName,
    );
    const currency = await this.findCurrencyByName(
      createOperationDto.currencyName,
    );

    const { name, moneyAmount, date } = createOperationDto;

    const data: Prisma.OperationCreateInput = {
      name,
      moneyAmount,
      date: new Date(date),
      currency: {
        connect: {
          id: currency.id,
        },
      },
      category: {
        connect: {
          id: category.id,
        },
      },
    };
    return await this.operationsService.create(data);
  }

  async removeOperation(id: number): Promise<boolean> {
    return await this.operationsService.remove(id);
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  async removeCategory(id: number): Promise<boolean> {
    await this.validateZeroOperations(id);

    return await this.categoriesService.remove(id);
  }

  private async findCurrencyByName(name: string): Promise<Currency> {
    const userToCurrency = await this.prisma.userToCurrencies.findFirst({
      include: {
        currency: true,
      },
      where: {
        userId: this.request.user.id,
        currency: {
          name,
        },
      },
    });

    if (!userToCurrency) {
      throw new HttpException(
        `Currency '${name}' not found`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return userToCurrency.currency;
  }

  private async findCategoryByName(name: string): Promise<Category> {
    const category = await this.prisma.category.findFirst({ where: { name } });

    if (!category) {
      throw new HttpException(
        `Category '${name}' not found`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return category;
  }

  private async validateZeroOperations(id: number): Promise<void> {
    const operationsNumber = await this.prisma.operation.count({
      where: {
        categoryId: id,
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
