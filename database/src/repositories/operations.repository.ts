import { Category, Currency, Operation, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database/prisma';
import { SearchOperationDto } from '@app/api/src/modules/operations/operations/dto';
import { prismaComparisonOperatorsMap } from '@app/common/enums/prisma-comparison-operators-map';

@Injectable()
export class OperationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: number,
    query: SearchOperationDto,
  ): Promise<(Operation & { currency: Currency; category: Category })[]> {
    return await this.prisma.operation.findMany({
      where: {
        AND: [this.applyFindAllFilters(userId, query)],
      },
      include: {
        category: true,
        currency: true,
      },
    });
  }

  async findById(
    operationId: number,
    userId: number,
  ): Promise<Operation | null> {
    return await this.prisma.operation.findFirst({
      where: {
        id: operationId,
        category: {
          userId,
        },
      },
    });
  }

  async findByReferentialNumberAndOrigin(
    referentialNumber: string,
    origin: string,
    userId: number,
  ): Promise<Operation | null> {
    return await this.prisma.operation.findFirst({
      where: {
        origin,
        referentialNumber,
        category: {
          userId,
        },
      },
    });
  }

  async findManyByCategoryId(
    categoryId: number,
  ): Promise<(Operation & { category: Category })[]> {
    return await this.prisma.operation.findMany({
      where: {
        category: {
          id: categoryId,
        },
      },
      include: {
        category: true,
      },
    });
  }

  async create(data: Prisma.OperationCreateInput): Promise<Operation> {
    return await this.prisma.operation.create({ data });
  }

  async update(
    id: number,
    data: Prisma.OperationUpdateInput,
  ): Promise<Operation> {
    return await this.prisma.operation.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number): Promise<Operation> {
    return await this.prisma.operation.delete({
      where: {
        id,
      },
    });
  }

  private applyFindAllFilters(
    userId: number,
    query: SearchOperationDto,
  ): Prisma.OperationWhereInput {
    const {
      startDate,
      endDate,
      categoryType,
      searchName,
      isInternal,
      operator,
      moneyAmount,
    } = query;

    const andFilter: Prisma.OperationWhereInput = {
      category: {
        userId,
      },
    };

    if (startDate && endDate) {
      andFilter['date'] = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (categoryType) {
      if (andFilter['category']) {
        andFilter['category']['type'] = categoryType;
      }
    }

    if (isInternal) {
      if (andFilter['category']) {
        andFilter['category']['isInternal'] = isInternal;
      }
    }

    if (operator && moneyAmount) {
      const prismaOperatorName = prismaComparisonOperatorsMap[operator];

      const decimalFilter: Prisma.DecimalFilter = {
        [prismaOperatorName]: moneyAmount,
      } as Prisma.DecimalFilter;

      andFilter['moneyAmount'] = {
        ...decimalFilter,
      };
    }

    if (searchName) {
      andFilter['OR'] = [
        {
          name: {
            mode: 'insensitive',
            contains: searchName,
          },
        },
        {
          category: {
            name: {
              mode: 'insensitive',
              contains: searchName,
            },
          },
        },
      ];
    }

    return andFilter;
  }
}
