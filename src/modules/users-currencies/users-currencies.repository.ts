import { PrismaService } from '../prisma/prisma.service';
import { Currency, Prisma, UsersCurrencies } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersCurrenciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: number,
  ): Promise<(UsersCurrencies & { currency: Currency })[]> {
    return await this.prisma.usersCurrencies.findMany({
      where: {
        userId,
      },
      include: {
        currency: true,
      },
    });
  }

  async findById(
    currencyId: number,
    userId: number,
  ): Promise<UsersCurrencies | null> {
    return await this.prisma.usersCurrencies.findFirst({
      where: {
        currencyId,
        userId,
      },
    });
  }

  async findByName(
    name: string,
    userId: number,
  ): Promise<(UsersCurrencies & { currency: Currency }) | null> {
    return await this.prisma.usersCurrencies.findFirst({
      where: {
        userId,
        currency: {
          name,
        },
      },
      include: {
        currency: true,
      },
    });
  }

  async create(
    data: Prisma.UsersCurrenciesCreateInput,
  ): Promise<UsersCurrencies> {
    return await this.prisma.usersCurrencies.create({ data });
  }

  async findUsersDefault(
    userId: number,
  ): Promise<(UsersCurrencies & { currency: Currency }) | null> {
    return await this.prisma.usersCurrencies.findFirst({
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
  }
}
