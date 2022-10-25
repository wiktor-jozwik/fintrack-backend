import { Injectable } from '@nestjs/common';
import { CurrencyRate, Prisma } from '@prisma/client';
import { PrismaService } from '@app/database/prisma';

@Injectable()
export class CurrencyRatesRepository {
  constructor(private readonly prisma: PrismaService) {}

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
