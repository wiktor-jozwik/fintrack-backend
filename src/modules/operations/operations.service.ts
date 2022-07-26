import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Category from '../../database/entities/category.entity';
import { Repository } from 'typeorm';
import Operation from '../../database/entities/operation.entity';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
  ) {}
  create(createOperationDto: CreateOperationDto) {
    return 'This action adds a new operation';
  }

  findAll() {
    return `This action returns all operations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operation`;
  }

  update(id: number, updateOperationDto: UpdateOperationDto) {
    return `This action updates a #${id} operation`;
  }

  remove(id: number) {
    return `This action removes a #${id} operation`;
  }

  async findOperationsByCategoryId(categoryId: number): Promise<Operation[]> {
    return await this.operationRepository.find({ where: { categoryId } });
  }
}
