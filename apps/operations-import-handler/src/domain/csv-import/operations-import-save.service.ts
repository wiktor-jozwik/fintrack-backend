import { Injectable } from '@nestjs/common';
import { CategoryType, Operation, Prisma } from '@prisma/client';
import { PrismaCodes } from '@app/common/enums/prisma-codes.enum';
import {
  CategoriesRepository,
  OperationsRepository,
  UsersCurrenciesRepository,
  UsersRepository,
} from '@app/database';
import {
  CategoryNotFoundException,
  CurrencyNotAddedException,
  OperationAlreadyImportedException,
  UserNotFoundException,
} from '@app/common/exceptions';
import { SaveOperationItem } from './interfaces';

@Injectable()
export class OperationsImportSaveService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly operationsRepository: OperationsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly usersCurrenciesRepository: UsersCurrenciesRepository,
  ) {}

  async validateUserExistence(userId: number): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(null);
    }
  }

  async findCurrency(currencyName: string, userId: number): Promise<number> {
    const userCurrency = await this.usersCurrenciesRepository.findByName(
      currencyName,
      userId,
    );

    if (!userCurrency) {
      throw new CurrencyNotAddedException(currencyName);
    }

    return userCurrency.currencyId;
  }

  async saveOrFindCategory(
    categoryType: CategoryType,
    categoryName: string,
    userId: number,
  ): Promise<number> {
    const category = await this.categoriesRepository.findByNameAndType(
      categoryName,
      categoryType,
      userId,
    );
    if (category) {
      return category.id;
    }

    let categoryId;
    try {
      const category = await this.categoriesRepository.create({
        name: categoryName,
        type: categoryType,
        user: {
          connect: {
            id: userId,
          },
        },
      });
      categoryId = category.id;
    } catch (err) {
      if (this.checkIfUniqueConstraintViolated(err)) {
        const category = await this.categoriesRepository.findByNameAndType(
          categoryName,
          categoryType,
          userId,
        );
        if (!category) {
          throw new CategoryNotFoundException(undefined, categoryName);
        }
        categoryId = category.id;
      } else {
        throw err;
      }
    }

    return categoryId;
  }

  async saveOperation(
    saveOperationItem: SaveOperationItem,
  ): Promise<Operation> {
    const {
      referentialNumber,
      originName,
      isoDateString,
      absMoneyAmount,
      operationName,
      userId,
      categoryId,
      currencyId,
    } = saveOperationItem;

    const operation =
      await this.operationsRepository.findByReferentialNumberAndOrigin(
        referentialNumber,
        originName,
        userId,
      );

    if (operation) {
      throw new OperationAlreadyImportedException(
        referentialNumber,
        originName,
      );
    }

    return await this.operationsRepository.create({
      name: operationName,
      origin: originName,
      referentialNumber,
      date: new Date(isoDateString),
      moneyAmount: absMoneyAmount,
      category: {
        connect: {
          id: categoryId,
        },
      },
      currency: {
        connect: {
          id: currencyId,
        },
      },
    });
  }

  private checkIfUniqueConstraintViolated(err: Error): boolean {
    return (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === PrismaCodes.UNIQUE_CONSTRAINT_VIOLATION_CODE
    );
  }
}
