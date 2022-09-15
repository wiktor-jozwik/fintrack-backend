import { Injectable } from '@nestjs/common';
import { isValidIsoDate } from '../../common/utils/is-valid-iso-date';
import { Category, Currency, Operation } from '@prisma/client';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationNotFoundException } from './exceptions/operation-not-found.exception';
import { CategoryNotFoundException } from '../categories/exceptions/category-not-found.exception';
import { InvalidDateFormatException } from './exceptions/invalid-date-format.exception';
import { CurrencyNotAddedException } from '../users-currencies/exceptions/currency-not-added.exception';
import { OperationsRepository } from './operations.repository';
import { CategoriesRepository } from '../categories/categories.repository';
import { UsersCurrenciesRepository } from '../users-currencies/users-currencies.repository';
import { SearchOperationDto } from './dto/search-operation.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Injectable()
export class OperationsService {
  constructor(
    private readonly operationsRepository: OperationsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly usersCurrenciesRepository: UsersCurrenciesRepository,
  ) {}

  async create(
    createOperationDto: CreateOperationDto,
    userId: number,
  ): Promise<Operation> {
    const category = await this.findCategoryAndValidate(
      createOperationDto.categoryName,
      userId,
    );
    const currency = await this.findCurrencyAndValidate(
      createOperationDto.currencyName,
      userId,
    );

    const date = this.validateDate(createOperationDto.date);
    const { name, moneyAmount } = createOperationDto;

    return await this.operationsRepository.create({
      name,
      moneyAmount,
      date,
      currency: {
        connect: {
          id: currency.id,
        },
      },
      category: {
        connect: {
          id: category.id,
        },
      },
    });
  }

  async findAll(
    userId: number,
    query: SearchOperationDto,
  ): Promise<Operation[]> {
    const { startDate, endDate } = query;

    return await this.operationsRepository.findAll(userId, startDate, endDate);
  }

  async update(
    updateOperationDto: UpdateOperationDto,
    operationId: number,
    userId: number,
  ): Promise<Operation> {
    await this.validateOperationPresence(operationId, userId);

    const { categoryName, currencyName } = updateOperationDto;
    updateOperationDto.currencyName = undefined;
    updateOperationDto.categoryName = undefined;

    let categoryId;
    let currencyId;
    if (categoryName) {
      const category = await this.findCategoryAndValidate(categoryName, userId);
      categoryId = category.id;
    }

    if (currencyName) {
      const currency = await this.findCurrencyAndValidate(currencyName, userId);
      currencyId = currency.id;
    }

    if (updateOperationDto.date) {
      updateOperationDto.date = this.validateDate(updateOperationDto.date);
    }

    return await this.operationsRepository.update(operationId, {
      ...updateOperationDto,
      currency: currencyId
        ? {
            connect: {
              id: currencyId,
            },
          }
        : {},
      category: categoryId
        ? {
            connect: {
              id: categoryId,
            },
          }
        : {},
    });
  }

  async remove(operationId: number, userId: number): Promise<Operation> {
    await this.validateOperationPresence(operationId, userId);

    return await this.operationsRepository.delete(operationId);
  }

  private async validateOperationPresence(
    operationId: number,
    userId: number,
  ): Promise<void> {
    const operation = await this.operationsRepository.findById(
      operationId,
      userId,
    );

    if (!operation) {
      throw new OperationNotFoundException(operationId);
    }
  }

  private async findCurrencyAndValidate(
    name: string,
    userId: number,
  ): Promise<Currency> {
    const usersCurrencies = await this.usersCurrenciesRepository.findByName(
      name,
      userId,
    );

    if (!usersCurrencies) {
      throw new CurrencyNotAddedException(name);
    }
    return usersCurrencies.currency;
  }

  private async findCategoryAndValidate(
    name: string,
    userId: number,
  ): Promise<Category> {
    const category = await this.categoriesRepository.findByName(name, userId);

    if (!category) {
      throw new CategoryNotFoundException(undefined, name);
    }

    return category;
  }

  private validateDate(date: Date): Date {
    const validDate = isValidIsoDate(date);
    if (!validDate) {
      throw new InvalidDateFormatException();
    }

    return new Date(date);
  }
}
