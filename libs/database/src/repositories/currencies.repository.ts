import { Currency } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class CurrenciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Currency[]> {
    return await this.prisma.currency.findMany({});
  }

  async findByName(name: string): Promise<Currency | null> {
    return await this.prisma.currency.findFirst({
      where: { name },
    });
  }
}
