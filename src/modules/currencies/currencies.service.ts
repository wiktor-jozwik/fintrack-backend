import { Injectable } from '@nestjs/common';
import { Currency } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Currency[]> {
    return await this.prisma.currency.findMany();
  }
}
