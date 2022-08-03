import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from '../auth/auth-request';
import UserCurrency from '../../database/entities/user-currency.entity';
import Currency from '../../database/entities/currency.entity';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(UserCurrency)
    private readonly userCurrencyRepository: Repository<UserCurrency>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @Inject(REQUEST) private request: AuthRequest,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<UserCurrency> {
    return this.createUserCurrency(
      createCurrencyDto.name,
      this.request.user.id,
    );
  }

  async findAll(): Promise<Currency[]> {
    return this.currencyRepository.find();
  }

  async findUserAll(): Promise<Currency[]> {
    const userCurrencies = await this.userCurrencyRepository.find({
      where: {
        userId: this.request.user.id,
      },
      relations: ['currency'],
    });

    return userCurrencies.map((userCurrency) => userCurrency.currency);
  }

  async findDefault(): Promise<Currency> {
    const userCurrency = await this.userCurrencyRepository.findOne({
      where: {
        userId: this.request.user.id,
      },
      relations: ['currency'],
    });

    if (!userCurrency) {
      throw new HttpException(
        'Default currency not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return userCurrency.currency;
  }

  async createUserCurrency(currencyName: string, userId: number) {
    const currency = await this.findByName(currencyName);

    if (!currency) {
      throw new HttpException(
        `Currency ${currencyName} not supported`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const createUserCurrency = {
      userId: userId,
      currencyId: currency.id,
    };

    return await this.userCurrencyRepository.save(createUserCurrency);
  }

  private async findByName(name: string): Promise<Currency | null> {
    return await this.currencyRepository.findOne({
      where: { name },
    });
  }
}
