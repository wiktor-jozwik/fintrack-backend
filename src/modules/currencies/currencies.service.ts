import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';
import { Currency, Prisma, UserToCurrencies } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}

  async create(
    createCurrencyDto: CreateCurrencyDto,
  ): Promise<UserToCurrencies> {
    const currency = await this.getSupportedCurrency(createCurrencyDto.name);

    return this.createUserCurrency(currency, this.request.user.id);
  }

  async findAll(): Promise<Currency[]> {
    return await this.prisma.currency.findMany();
  }

  async findUserAll(): Promise<Currency[]> {
    const userToCurrencies = await this.prisma.userToCurrencies.findMany({
      where: {
        userId: this.request.user.id,
      },
      include: {
        currency: true,
      },
    });

    return userToCurrencies.map((userToCurrency) => userToCurrency.currency);
  }

  async findDefault(): Promise<Currency> {
    const userToCurrencies = await this.prisma.userToCurrencies.findFirst({
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
      where: {
        userId: this.request.user.id,
      },
      include: {
        currency: true,
      },
    });

    if (!userToCurrencies) {
      throw new HttpException(
        'Default currency not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return userToCurrencies.currency;
  }

  async createUserCurrency(currency: Currency, userId: number) {
    await this.checkIfCurrencyCanBeAdded(currency, userId);

    const data: Prisma.UserToCurrenciesCreateInput = {
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
    };
    return await this.prisma.userToCurrencies.create({ data });
  }

  async checkIfCurrencyCanBeAdded(currency: Currency, userId: number) {
    const existingCurrency = await this.prisma.userToCurrencies.findFirst({
      where: {
        currencyId: currency.id,
        userId,
      },
    });
    if (existingCurrency) {
      throw new HttpException(
        `Currency ${currency.name} already added`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async getSupportedCurrency(name: string): Promise<Currency> {
    const currency = await this.findByName(name);

    if (!currency) {
      throw new HttpException(
        `Currency ${name} not supported`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return currency;
  }

  async findByName(name: string): Promise<Currency | null> {
    return await this.prisma.currency.findFirst({
      where: { name },
    });
  }
}
