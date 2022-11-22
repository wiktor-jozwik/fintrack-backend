import { Injectable } from '@nestjs/common';
import { Currency } from '@prisma/client';
import { CurrenciesRepository, UsersCurrenciesRepository } from '@app/database';
import {
  CurrencyAlreadyAddedException,
  DefaultCurrencyDeleteException,
  DefaultCurrencyNotFoundException,
} from '@app/common/exceptions';
import { CreateCurrencyDto } from '../dto';
import { CurrenciesValidatorService } from '@app/api/src/modules/currencies/services';
import { UsersCurrenciesValidatorService } from '@app/api/src/modules/users-currencies/services/users-currencies-validator.service';

@Injectable()
export class UsersCurrenciesService {
  constructor(
    private readonly currenciesValidatorService: CurrenciesValidatorService,
    private readonly usersCurrenciesValidatorService: UsersCurrenciesValidatorService,
    private readonly usersCurrenciesRepository: UsersCurrenciesRepository,
    private readonly currenciesRepository: CurrenciesRepository,
  ) {}
  async create(
    createCurrencyDto: CreateCurrencyDto,
    userId: number,
  ): Promise<Currency> {
    const currency =
      await this.currenciesValidatorService.findAndValidateCurrency(
        createCurrencyDto.name,
      );

    await this.createUsersCurrency(currency, userId);

    return currency;
  }

  async remove(userCurrencyId: number, userId: number): Promise<Currency> {
    const usersCurrency =
      await this.usersCurrenciesValidatorService.findAndValidateUsersCurrency(
        userCurrencyId,
        userId,
      );

    const defaultCurrency = await this.findDefault(userId);
    const currencyName = usersCurrency.currency?.name;

    if (currencyName === defaultCurrency.name) {
      throw new DefaultCurrencyDeleteException(currencyName);
    }

    await this.usersCurrenciesRepository.delete(usersCurrency);
    return usersCurrency.currency;
  }

  async findAll(userId: number): Promise<Currency[]> {
    const usersCurrencies = await this.usersCurrenciesRepository.findAll(
      userId,
    );

    return usersCurrencies.map((usersCurrency) => usersCurrency.currency);
  }

  async findAllWithoutDefault(userId: number): Promise<Currency[]> {
    const currencies = await this.currenciesRepository.findAll();

    const userDefault = await this.findDefault(userId);

    return currencies.filter((currency) => currency.name !== userDefault.name);
  }

  async findDefault(userId: number): Promise<Currency> {
    const userToCurrencies =
      await this.usersCurrenciesRepository.findUsersDefault(userId);

    if (!userToCurrencies) {
      throw new DefaultCurrencyNotFoundException();
    }

    return userToCurrencies.currency;
  }

  async createUsersCurrency(currency: Currency, userId: number) {
    await this.checkIfCurrencyCanBeAdded(currency, userId);

    return await this.usersCurrenciesRepository.create({
      user: {
        connect: {
          id: userId,
        },
      },
      currency: {
        connect: {
          id: currency.id,
        },
      },
    });
  }

  private async checkIfCurrencyCanBeAdded(currency: Currency, userId: number) {
    const existingCurrency = await this.usersCurrenciesRepository.findById(
      currency.id,
      userId,
    );

    if (existingCurrency) {
      throw new CurrencyAlreadyAddedException(currency.name);
    }
  }
}
