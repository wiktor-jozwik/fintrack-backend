import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Operation, {
  OperationCreate,
} from '../../../database/entities/operation.entity';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../../auth/auth-request';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}
  async create(operation: OperationCreate) {
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
  // remove(id: number) {
  //   return `This action removes a #${id} operation`;
  // }

  async findByCategoryId(categoryId: number) {
    return await this.operationRepository.find({ where: { categoryId } });
  }
}
