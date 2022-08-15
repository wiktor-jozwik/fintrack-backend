import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Currency, UserToCurrencies } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';

@Injectable()
export class UsersCurrenciesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}
  async create(
    createCurrencyDto: CreateCurrencyDto,
  ): Promise<UserToCurrencies> {
    const currency = await this.getSupportedCurrency(createCurrencyDto.name);

    return this.createUserCurrency(currency, this.request.user.id);
  }

  async findAll(): Promise<Currency[]> {
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
      throw new HttpException(
        `Currency '${currency.name}' already added`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async getSupportedCurrency(name: string): Promise<Currency> {
    const currency = await this.findByName(name);

    if (!currency) {
      throw new HttpException(
        `Currency '${name}' not supported`,
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
