import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidIsoDate } from '../../utils/is-valid-iso-date';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Currency, Operation } from '@prisma/client';
import { CreateOperationDto } from './dto/create-operation.dto';

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    const category = await this.findCategoryAndValidate(
      userId,
      createOperationDto.categoryName,
    );
    const currency = await this.findCurrencyAndValidate(
      userId,
      createOperationDto.currencyName,
    );

    const date = this.validateDate(createOperationDto.date);
    const { name, moneyAmount } = createOperationDto;

    return await this.prisma.operation.create({
      data: {
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
      },
    });
  }

  async findAll(userId: number): Promise<Operation[]> {
    return await this.prisma.operation.findMany({
      include: {
        category: true,
      },
      where: {
        category: {
          userId,
        },
      },
    });
  }

  async remove(userId: number, operationId: number): Promise<Operation> {
    const operation = await this.findOperationAndValidate(userId, operationId);

    return await this.prisma.operation.delete({ where: { id: operation.id } });
  }

  private async findOperationAndValidate(
    userId: number,
    operationId: number,
  ): Promise<Operation> {
    const operation = await this.prisma.operation.findFirst({
      include: {
        category: true,
      },
      where: {
        id: operationId,
        category: {
          userId,
        },
      },
    });

    if (!operation) {
      throw new NotFoundException('Operation not found');
    }
    return operation;
  }

  private async findCurrencyAndValidate(
    userId: number,
    name: string,
  ): Promise<Currency> {
    const userToCurrency = await this.prisma.userToCurrencies.findFirst({
      include: {
        currency: true,
      },
      where: {
        userId,
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

  private async findCategoryAndValidate(
    userId: number,
    name: string,
  ): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        userId,
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
