import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';
import { isValidIsoDate } from '../../utils/is-valid-iso-date';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Currency, Operation, Prisma } from '@prisma/client';
import { CreateOperationDto } from './dto/create-operation.dto';

@Injectable()
export class OperationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}
  async create(createOperationDto: CreateOperationDto): Promise<Operation> {
    const category = await this.findCategoryAndValidate(
      createOperationDto.categoryName,
    );
    const currency = await this.findCurrencyAndValidate(
      createOperationDto.currencyName,
    );

    const date = this.validateDate(createOperationDto.date);
    const { name, moneyAmount } = createOperationDto;

    const data: Prisma.OperationCreateInput = {
      name,
      moneyAmount,
      date,
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

    return await this.prisma.operation.create({ data });
  }

  async findAll(): Promise<Operation[]> {
    return await this.prisma.operation.findMany({
      include: {
        category: true,
      },
      where: {
        category: {
          userId: this.request.user.id,
        },
      },
    });
  }

  async remove(id: number): Promise<boolean> {
    const operation = await this.findOperationAndValidate(id);

    try {
      await this.prisma.operation.delete({ where: { id: operation.id } });
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }

  private async findOperationAndValidate(id: number): Promise<Operation> {
    const operation = await this.prisma.operation.findFirst({
      include: {
        category: true,
      },
      where: {
        id,
        category: {
          userId: this.request.user.id,
        },
      },
    });
    if (!operation) {
      throw new NotFoundException('Operation not found');
    }
    return operation;
  }

  private async findCurrencyAndValidate(name: string): Promise<Currency> {
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
        `Currency '${name}' not added to account`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return userToCurrency.currency;
  }

  private async findCategoryAndValidate(name: string): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        userId: this.request.user.id,
        name,
      },
    });

    if (!category) {
      throw new HttpException(
        `Category '${name}' not found`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return category;
  }

  private validateDate(date: Date): Date {
    const validDate = isValidIsoDate(date);
    if (!validDate) {
      throw new HttpException(
        'Provided date was invalid. Provide date in YYYY-MM-DD format',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return new Date(date);
  }
}
