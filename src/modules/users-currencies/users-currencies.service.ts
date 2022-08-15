import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Currency, UserToCurrencies } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencyNotSupportedException } from './exceptions/currency-not-supported.exception';
import { CurrencyAlreadyAddedException } from './exceptions/currency-already-added.exception';
import { DefaultCurrencyNotFoundException } from './exceptions/default-currency-not-found.exception';

@Injectable()
export class UsersCurrenciesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    userId: number,
    createCurrencyDto: CreateCurrencyDto,
  ): Promise<UserToCurrencies> {
    const currency = await this.getSupportedCurrency(createCurrencyDto.name);

    return this.createUserCurrency(currency, userId);
  }

  async findAll(userId: number): Promise<Currency[]> {
    const userToCurrencies = await this.prisma.userToCurrencies.findMany({
      where: {
        userId,
      },
      include: {
        currency: true,
      },
    });

    return userToCurrencies.map((userToCurrency) => userToCurrency.currency);
  }

  async findDefault(userId: number): Promise<Currency> {
    const userToCurrencies = await this.prisma.userToCurrencies.findFirst({
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
      where: {
        userId,
      },
      include: {
        currency: true,
      },
    });

    if (!userToCurrencies) {
      throw new DefaultCurrencyNotFoundException();
    }

    return userToCurrencies.currency;
  }

  async createUserCurrency(currency: Currency, userId: number) {
    await this.checkIfCurrencyCanBeAdded(currency, userId);

    return await this.prisma.userToCurrencies.create({
      data: {
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
      },
    });
  }

  async checkIfCurrencyCanBeAdded(currency: Currency, userId: number) {
    const existingCurrency = await this.prisma.userToCurrencies.findFirst({
      where: {
        currencyId: currency.id,
        userId,
      },
    });
    if (existingCurrency) {
      throw new CurrencyAlreadyAddedException(currency.name);
    }
  }

  async getSupportedCurrency(name: string): Promise<Currency> {
    const currency = await this.findByName(name);

    if (!currency) {
      throw new CurrencyNotSupportedException(name);
    }

    return currency;
  }

  async findByName(name: string): Promise<Currency | null> {
    return await this.prisma.currency.findFirst({
      where: { name },
    });
  }
}
