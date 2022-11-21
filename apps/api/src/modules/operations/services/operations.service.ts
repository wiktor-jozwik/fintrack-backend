import { Injectable } from '@nestjs/common';
import { Category, Currency, Operation } from '@prisma/client';
import { DefaultCurrencyOperationCalculatorService } from './default-currency-operation-calculator.service';
import {
  CategoriesRepository,
  OperationsRepository,
  UsersCurrenciesRepository,
} from '@app/database';
import { DefaultCurrencyNotFoundException } from '@app/common/exceptions';
import {
  CreateOperationDto,
  SearchOperationDto,
  UpdateOperationDto,
} from '../dto';
import { DefaultCurrencyOperationResponse } from '../../../modules/operations/responses';
import { CategoriesValidatorService } from '@app/api/src/modules/categories/services';
import { CurrenciesValidatorService } from '@app/api/src/modules/currencies/services';
import { OperationsValidatorService } from '@app/api/src/modules/operations/services/operations-validator.service';
import { UsersCurrenciesValidatorService } from '@app/api/src/modules/users-currencies/services';

@Injectable()
export class OperationsService {
  constructor(
    private readonly categoriesValidatorService: CategoriesValidatorService,
    private readonly usersCurrenciesValidatorService: UsersCurrenciesValidatorService,
    private readonly operationsValidatorService: OperationsValidatorService,
    private readonly defaultCurrencyOperationCalculatorService: DefaultCurrencyOperationCalculatorService,
    private readonly operationsRepository: OperationsRepository,
  ) {}

  async create(
    createOperationDto: CreateOperationDto,
    userId: number,
  ): Promise<Operation> {
    const category =
      await this.categoriesValidatorService.findAndValidateCategory(
        createOperationDto.categoryName,
        userId,
      );
    const usersCurrency =
      await this.usersCurrenciesValidatorService.findAndValidateUsersCurrency(
        createOperationDto.currencyName,
        userId,
      );
    const currency = usersCurrency.currency;

    const date = this.operationsValidatorService.validateDate(
      createOperationDto.date,
    );
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
  ): Promise<(Operation & { currency: Currency; category: Category })[]> {
    return await this.operationsRepository.findAll(userId, query);
  }

  async findAllInDefaultCurrency(
    userId: number,
    query: SearchOperationDto,
  ): Promise<DefaultCurrencyOperationResponse[]> {
    const defaultCurrencyOperations: DefaultCurrencyOperationResponse[] = [];
    const operations = await this.findAll(userId, query);

    const defaultCurrency =
      await this.usersCurrenciesValidatorService.findAndValidateUsersDefaultCurrency(
        userId,
      );

    const defaultCurrencyName = defaultCurrency.currency.name;

    for (const operation of operations) {
      const operationCurrencyRate =
        await this.defaultCurrencyOperationCalculatorService.getOperationCurrencyRateInDefaultCurrency(
          operation,
          defaultCurrencyName,
        );

      const moneyAmountInDefaultCurrency =
        Number(operation.moneyAmount) * operationCurrencyRate;

      defaultCurrencyOperations.push({
        name: operation.name,
        moneyAmountInDefaultCurrency,
        date: operation.date,
        category: operation.category,
      });
    }

    return defaultCurrencyOperations;
  }

  async update(
    updateOperationDto: UpdateOperationDto,
    operationId: number,
    userId: number,
  ): Promise<Operation> {
    await this.operationsValidatorService.findAndValidateOperation(
      operationId,
      userId,
    );

    const { categoryName, currencyName } = updateOperationDto;
    updateOperationDto.currencyName = undefined;
    updateOperationDto.categoryName = undefined;

    let categoryId;
    let currencyId;
    if (categoryName) {
      const category =
        await this.categoriesValidatorService.findAndValidateCategory(
          categoryName,
          userId,
        );
      categoryId = category.id;
    }

    if (currencyName) {
      const usersCurrency =
        await this.usersCurrenciesValidatorService.findAndValidateUsersCurrency(
          currencyName,
          userId,
        );
      currencyId = usersCurrency.currency.id;
    }

    if (updateOperationDto.date) {
      updateOperationDto.date = this.operationsValidatorService.validateDate(
        updateOperationDto.date,
      );
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
    await this.operationsValidatorService.findAndValidateOperation(
      operationId,
      userId,
    );

    return await this.operationsRepository.delete(operationId);
  }
}
