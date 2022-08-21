import { Injectable } from '@nestjs/common';
import { Currency } from '@prisma/client';
import { CurrenciesRepository } from './currencies.repository';

@Injectable()
export class CurrenciesService {
  constructor(private readonly currenciesRepository: CurrenciesRepository) {}

  async findAll(): Promise<Currency[]> {
    return await this.currenciesRepository.findAll();
  }
}
