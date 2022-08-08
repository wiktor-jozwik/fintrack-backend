import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../../auth/auth-request';
import { isValidIsoDate } from '../../../utils/is-valid-iso-date';
import { PrismaService } from '../../prisma/prisma.service';
import { Operation, Prisma } from '@prisma/client';

@Injectable()
export class OperationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}
  async create(operation: Prisma.OperationCreateInput): Promise<Operation> {
    const validDate = isValidIsoDate(operation.date);
    if (!validDate) {
      throw new HttpException(
        'Provided date was invalid. Provide date in YYYY-MM-DD format',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const data: Prisma.OperationCreateInput = operation;

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
    const operation = await this.findById(id);

    if (!operation) {
      throw new NotFoundException('Operation not found');
    }

    try {
      await this.prisma.operation.delete({ where: { id } });
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }

  private async findById(operationId: number): Promise<Operation | null> {
    return await this.prisma.operation.findFirst({
      include: {
        category: true,
      },
      where: {
        id: operationId,
        category: {
          userId: this.request.user.id,
        },
      },
    });
  }
}
