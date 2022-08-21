import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Currency, UsersCurrencies } from '@prisma/client';
import { CurrencyNotSupportedException } from './exceptions/currency-not-supported.exception';
import { CurrencyAlreadyAddedException } from './exceptions/currency-already-added.exception';
import { DefaultCurrencyNotFoundException } from './exceptions/default-currency-not-found.exception';
import { UsersCurrenciesRepository } from './users-currencies.repository';
import { CurrenciesRepository } from '../currencies/currencies.repository';

@Injectable()
export class UsersCurrenciesService {
  constructor(
    private readonly usersCurrenciesRepository: UsersCurrenciesRepository,
    private readonly currenciesRepository: CurrenciesRepository,
  ) {}
  async create(
    createCurrencyDto: CreateCurrencyDto,
    userId: number,
  ): Promise<UsersCurrencies> {
    const currency = await this.findSupportedCurrency(createCurrencyDto.name);

    return await this.createUsersCurrency(currency, userId);
  }

  async findAll(userId: number): Promise<Currency[]> {
    const usersCurrencies = await this.usersCurrenciesRepository.findAll(
      userId,
    );

    return usersCurrencies.map((usersCurrency) => usersCurrency.currency);
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

  async checkIfCurrencyCanBeAdded(currency: Currency, userId: number) {
    const existingCurrency = await this.usersCurrenciesRepository.findById(
      currency.id,
      userId,
    );

    if (existingCurrency) {
      throw new CurrencyAlreadyAddedException(currency.name);
    }
  }

  async findSupportedCurrency(name: string): Promise<Currency> {
    const currency = await this.currenciesRepository.findByName(name);

    if (!currency) {
      throw new CurrencyNotSupportedException(name);
    }

    return currency;
  }
}
