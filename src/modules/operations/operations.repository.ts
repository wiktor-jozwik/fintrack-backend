import { PrismaService } from '../prisma/prisma.service';
import { Category, Currency, Operation, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<(Operation & { currency: Currency; category: Category })[]> {
    const where =
      startDate && endDate
        ? {
            AND: [
              {
                category: {
                  userId,
                },
                date: {
                  gt: new Date(startDate),
                  lt: new Date(endDate),
                },
              },
            ],
          }
        : {
            category: {
              userId,
            },
          };
    return await this.prisma.operation.findMany({
      where,
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
}
