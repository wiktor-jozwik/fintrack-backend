import { Currency, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class CurrenciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Currency[]> {
    return await this.prisma.currency.findMany({
      where: {
        OR: [
          {
            currencyRates: {
              some: {
                date: {
                  equals: new Date('2002-01-02'),
                },
              },
            },
          },
          {
            name: 'PLN',
          },
        ],
      },
    });
  }

  async findByName(name: string): Promise<Currency | null> {
    return await this.prisma.currency.findFirst({
      where: { name },
    });
  }

  async count(): Promise<number> {
    return await this.prisma.currency.count();
  }

  async upsert(currency: Prisma.CurrencyCreateInput): Promise<Currency> {
    return await this.prisma.currency.upsert({
      where: { name: currency.name },
      update: {},
      create: {
        ...currency,
      },
    });
  }
}
