import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OperationsService } from '../operations/operations.service';
import { CategoriesService } from '../categories/categories.service';
import Operation, {
  OperationCreate,
} from '../../database/entities/operation.entity';
import { CreateOperationDto } from '../operations/dto/create-operation.dto';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';
import { InjectRepository } from '@nestjs/typeorm';
import Category from '../../database/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';

@Injectable()
export class OperationsCategoriesService {
  constructor(
    private readonly operationsService: OperationsService,
    private readonly categoriesService: CategoriesService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}

  async findAllOperations() {
    return await this.operationRepository.find({
      relations: ['category'],
      where: {
        category: {
          userId: this.request.user.id,
        },
      },
    });
  }

  async createOperation(createOperationDto: CreateOperationDto) {
    const category = await this.categoriesService.findCategoryByName(
      createOperationDto.name,
    );

    if (!category) {
      throw new HttpException(
        'Category not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const { name, moneyAmount } = createOperationDto;

    const operation: OperationCreate = {
      name,
      moneyAmount,
      category,
    };

    return await this.operationsService.create(operation);
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { userId: this.request.user.id },
    });
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    await this.validateNameUniqueness(createCategoryDto.name);

    return await this.categoryRepository.save({
      ...createCategoryDto,
      userId: this.request.user.id,
    });
  }

  async removeCategory(id: number): Promise<boolean> {
    await this.validateZeroOperations(id);

    const category = await this.categoriesService.findCategoryById(id);

    if (!category) {
      throw new HttpException(
        'Category not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      await this.categoryRepository.delete({ id });
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }

  private async validateZeroOperations(id: number): Promise<void> {
    const operations = await this.operationsService.findOperationsByCategoryId(
      id,
    );

    if (operations.length > 0) {
      throw new HttpException(
        'Category has operations assigned and cannot be deleted!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  private async validateNameUniqueness(name: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { userId: this.request.user.id, name },
    });

    if (category) {
      throw new HttpException(
        `Category with name: '${name}' already exists`,
        HttpStatus.CONFLICT,
      );
    }
  }
}
