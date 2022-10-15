import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { CurrencyRate } from '@prisma/client';

@Injectable()
class CurrencyRatesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findCurrencyRateForDate(
    currencyName: string,
    date: Date,
  ): Promise<CurrencyRate | null> {
    return await this.prismaService.currencyRate.findFirst({
      where: {
        date,
        currency: {
          name: currencyName,
        },
      },
    });
  }
}

export default CurrencyRatesRepository;
