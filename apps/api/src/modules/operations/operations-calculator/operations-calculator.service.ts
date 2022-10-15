import { Injectable } from '@nestjs/common';
import { Category, Currency, Operation } from '@prisma/client';
import { CalculateOperationsDto } from './dto/calculate-operations.dto';
import { UsersCurrenciesRepository } from '../../users-currencies/users-currencies.repository';
import { OperationsRepository } from '../operations/operations.repository';
import { Expenses } from './interfaces/expenses';
import { DefaultCurrencyNotFoundException } from '../../users-currencies/exceptions/default-currency-not-found.exception';
import { CategoryType } from '../../../common/enums/category-type.enum';
import CurrencyRatesRepository from '../../../database/repositories/currency-rates.repository';
import { OperationCurrencyRateNotFoundException } from '../operations/exceptions/operation-currency-rate-not-found.exception';

@Injectable()
export class OperationsCalculatorService {
  constructor(
    private readonly usersCurrenciesRepository: UsersCurrenciesRepository,
    private readonly operationsRepository: OperationsRepository,
    private readonly currencyRatesRepository: CurrencyRatesRepository,
  ) {}
  async calculate(
    userId: number,
    query: CalculateOperationsDto | null,
  ): Promise<Expenses> {
    let startDate = null;
    let endDate = null;
    if (query) {
      startDate = query.startDate;
      endDate = query.endDate;
    }

    const operations = await this.operationsRepository.findAll(
      userId,
      startDate,
      endDate,
    );

    const defaultCurrency =
      await this.usersCurrenciesRepository.findUsersDefault(userId);
    if (!defaultCurrency) {
      throw new DefaultCurrencyNotFoundException();
    }

    return await this.calculateExpenses(
      operations,
      defaultCurrency.currency.name,
    );
  }

  async calculateExpenses(
    operations: (Operation & { currency: Currency; category: Category })[],
    defaultCurrency: string,
  ): Promise<Expenses> {
    const moneyFactor = 100;
    const currencyFactor = 10000;

    let incomes = 0;
    let outcomes = 0;
    for (const operation of operations) {
      if (operation.category.isInternal) {
        continue;
      }

      const valueInDefaultCurrency = await this.getMoneyValueInDefaultCurrency(
        operation,
        defaultCurrency,
      );
      const categoryType = operation.category.type;
      const operationValueInt = Number(operation.moneyAmount) * moneyFactor;
      const currencyValueInt = valueInDefaultCurrency * currencyFactor;

      if (categoryType === CategoryType.INCOME) {
        incomes += operationValueInt * currencyValueInt;
      } else if (categoryType === CategoryType.OUTCOME) {
        outcomes += operationValueInt * currencyValueInt;
      }
    }

    incomes = this.roundDecimalMoney(incomes, moneyFactor, currencyFactor);

    outcomes = this.roundDecimalMoney(outcomes, moneyFactor, currencyFactor);

    return { incomes, outcomes };
  }

  private async getMoneyValueInDefaultCurrency(
    operation: Operation & { currency: Currency },
    defaultCurrencyName: string,
  ): Promise<number> {
    if (operation.currency.name === defaultCurrencyName) {
      return 1;
    }

    if (operation.currency.name === 'PLN') {
      const defaultCurrencyRateForDate = await this.findCurrencyRateOrThrow(
        defaultCurrencyName,
        operation.date,
      );
      return 1 / defaultCurrencyRateForDate.avgValue;
    }

    const operationCurrencyRateForDate = await this.findCurrencyRateOrThrow(
      operation.currency.name,
      operation.date,
    );

    if (defaultCurrencyName === 'PLN') {
      return operationCurrencyRateForDate.avgValue;
    }

    const defaultCurrencyRateForDate = await this.findCurrencyRateOrThrow(
      defaultCurrencyName,
      operation.date,
    );

    return (
      operationCurrencyRateForDate.avgValue /
      defaultCurrencyRateForDate.avgValue
    );
  }

  private async findCurrencyRateOrThrow(currencyName: string, date: Date) {
    const operationCurrencyRateForDate =
      await this.currencyRatesRepository.findCurrencyRateForDate(
        currencyName,
        date,
      );

    if (!operationCurrencyRateForDate) {
      throw new OperationCurrencyRateNotFoundException(currencyName, date);
    }

    return operationCurrencyRateForDate;
  }

  private roundDecimalMoney(
    moneyValue: number,
    moneyFactor: number,
    currencyFactor: number,
  ): number {
    return (
      Math.round(
        (moneyValue / (moneyFactor * currencyFactor) + Number.EPSILON) * 100,
      ) / 100
    );
  }
}
