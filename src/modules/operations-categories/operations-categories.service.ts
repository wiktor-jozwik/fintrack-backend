import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OperationsService } from './operations/operations.service';
import { CategoriesService } from './categories/categories.service';
import { OperationCreate } from '../../database/entities/operation.entity';
import { CreateOperationDto } from './operations/dto/create-operation.dto';
import Category from '../../database/entities/category.entity';
import { CreateCategoryDto } from './categories/dto/create-category.dto';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class OperationsCategoriesService {
  constructor(
    private readonly operationsService: OperationsService,
    private readonly categoriesService: CategoriesService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  async findAllOperations() {
    return await this.operationsService.findAll();
  }

  async createOperation(createOperationDto: CreateOperationDto) {
    const category = await this.findCategoryByName(
      createOperationDto.categoryName,
    );
    const currency = await this.findCurrencyByName(
      createOperationDto.currencyName,
    );

    const { name, moneyAmount, date } = createOperationDto;

    const operation: OperationCreate = {
      name,
      moneyAmount,
      date,
      category,
      currency,
    };

    return await this.operationsService.create(operation);
  }

  async removeOperation(id: number): Promise<boolean> {
    return await this.operationsService.remove(id);
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  async removeCategory(id: number): Promise<boolean> {
    await this.validateZeroOperations(id);

    return await this.categoriesService.remove(id);
  }

  private async findCurrencyByName(name: string) {
    const currency = await this.currenciesService.findByName(name);

    if (!currency) {
      throw new HttpException(
        'Currency not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return currency;
  }

  private async findCategoryByName(name: string) {
    const category = await this.categoriesService.findByName(name);

    if (!category) {
      throw new HttpException(
        'Category not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return category;
  }

  private async validateZeroOperations(id: number): Promise<void> {
    const operations = await this.operationsService.findByCategoryId(id);

    if (operations.length > 0) {
      throw new HttpException(
        'Category has operations assigned and cannot be deleted!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
