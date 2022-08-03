import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Operation, {
  OperationCreate,
} from '../../../database/entities/operation.entity';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../../auth/auth-request';
import { isValidIsoDate } from '../../../utils/is-valid-iso-date';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}
  async create(operation: OperationCreate): Promise<Operation> {
    const validDate = isValidIsoDate(operation.date);
    if (!validDate) {
      throw new HttpException(
        'Provided date was invalid. Provide date in YYYY-MM-DD format',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.operationRepository.save(operation);
  }

  async findAll(): Promise<Operation[]> {
    return await this.operationRepository.find({
      relations: ['category'],
      where: {
        category: {
          userId: this.request.user.id,
        },
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} operation`;
  // }
  //
  // update(id: number, updateOperationDto: UpdateOperationDto) {
  //   return `This action updates a #${id} operation`;
  // }
  //
  async remove(id: number): Promise<boolean> {
    const operation = await this.findById(id);

    if (!operation) {
      throw new NotFoundException('Operation not found');
    }

    try {
      await this.operationRepository.delete({ id });
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }

  async findByCategoryId(categoryId: number): Promise<Operation[]> {
    return await this.operationRepository.find({ where: { categoryId } });
  }

  private async findById(operationId: number): Promise<Operation | null> {
    return await this.operationRepository.findOne({
      relations: ['category'],
      where: {
        id: operationId,
        category: {
          userId: this.request.user.id,
        },
      },
    });
  }
}
