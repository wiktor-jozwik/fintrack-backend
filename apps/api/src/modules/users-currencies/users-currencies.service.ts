import { Injectable } from '@nestjs/common';
import { Currency, UsersCurrencies } from '@prisma/client';
import { CurrenciesRepository, UsersCurrenciesRepository } from '@app/database';
import {
  CurrencyAlreadyAddedException,
  CurrencyNotFoundException,
  CurrencyNotSupportedException,
  DefaultCurrencyDeleteException,
  DefaultCurrencyNotFoundException,
} from '@api/exceptions';
import { CreateCurrencyDto } from './dto';

@Injectable()
export class UsersCurrenciesService {
  constructor(
    private readonly usersCurrenciesRepository: UsersCurrenciesRepository,
    private readonly currenciesRepository: CurrenciesRepository,
  ) {}
  async create(
    createCurrencyDto: CreateCurrencyDto,
    userId: number,
  ): Promise<Currency> {
    const currency = await this.findSupportedCurrency(createCurrencyDto.name);

    await this.createUsersCurrency(currency, userId);

    return currency;
  }

  async remove(userCurrencyId: number, userId: number): Promise<Currency> {
    const userCurrency = await this.usersCurrenciesRepository.findById(
      userCurrencyId,
      userId,
    );

    if (!userCurrency) {
      throw new CurrencyNotFoundException(userCurrencyId);
    }

    const defaultCurrency = await this.findDefault(userId);
    const currencyName = userCurrency.currency?.name;

    if (currencyName === defaultCurrency.name) {
      throw new DefaultCurrencyDeleteException(currencyName);
    }

    await this.usersCurrenciesRepository.delete(userCurrency);
    return userCurrency.currency;
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

  async findSupportedCurrency(name: string): Promise<Currency> {
    const currency = await this.currenciesRepository.findByName(name);

    if (!currency) {
      throw new CurrencyNotSupportedException(name);
    }

    return currency;
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
