import { Injectable } from '@nestjs/common';
import { CurrencyRate, Prisma } from '@prisma/client';
import { PrismaService } from '@app/database/prisma';

@Injectable()
export class CurrencyRatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrencyRatesForDates(
    currencyName: string,
    startDate: string,
    endDate: string,
  ): Promise<CurrencyRate[]> {
    return await this.prisma.currencyRate.findMany({
      where: {
        currency: {
          name: currencyName,
        },
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async countCurrency(currencyName: string): Promise<number> {
    return await this.prisma.currencyRate.count({
      where: {
        currency: {
          name: currencyName,
        },
      },
    });
  }

  async findCurrencyRateForDate(
    currencyName: string,
    date: Date,
  ): Promise<CurrencyRate | null> {
    return await this.prisma.currencyRate.findFirst({
      where: {
        date,
        currency: {
          name: currencyName,
        },
      },
    });
  }

  async create(data: Prisma.CurrencyRateCreateInput): Promise<CurrencyRate> {
    return await this.prisma.currencyRate.create({ data });
  }
}
