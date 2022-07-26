import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Operation, {
  OperationCreate,
} from '../../database/entities/operation.entity';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';
import { OperationsCategoriesService } from '../operations-categories/operations-categories.service';

@Injectable()
export class OperationsService {
  async create(operation: OperationCreate) {
    // return await this.operationRepository.save(operation);
  }

  // async findAll(): Promise<Operation[]> {
  //
  // }

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

  async findOperationsByCategoryId(categoryId: number) {
    // return await this.operationRepository.find({ where: { categoryId } });
  }
}
