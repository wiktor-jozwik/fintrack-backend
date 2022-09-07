import { PrismaService } from '../prisma/prisma.service';
import { Category, Currency, Operation, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<(Operation & { currency: Currency; category: Category })[]> {
    return await this.prisma.operation.findMany({
      where: {
        AND: [
          {
            category: {
              userId,
            },
            date: {
              gt: startDate,
              lt: endDate,
            },
          },
        ],
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

  async create(data: Prisma.OperationCreateInput): Promise<Operation> {
    return await this.prisma.operation.create({ data });
  }

  async delete(id: number): Promise<Operation> {
    return await this.prisma.operation.delete({
      where: {
        id,
      },
    });
  }

  async countByCategoryId(categoryId: number): Promise<number> {
    return await this.prisma.operation.count({
      where: {
        categoryId,
      },
    });
  }
}
