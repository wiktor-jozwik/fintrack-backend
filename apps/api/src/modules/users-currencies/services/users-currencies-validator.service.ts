import { Injectable } from '@nestjs/common';
import { UsersCurrenciesRepository } from '@app/database';
import { Currency, UsersCurrencies } from '@prisma/client';
import {
  CurrencyNotAddedException,
  DefaultCurrencyNotFoundException,
} from '@app/common/exceptions';

@Injectable()
export class UsersCurrenciesValidatorService {
  constructor(
    private readonly usersCurrenciesRepository: UsersCurrenciesRepository,
  ) {}

  async findAndValidateUsersDefaultCurrency(
    userId: number,
  ): Promise<UsersCurrencies & { currency: Currency }> {
    const usersDefault = await this.usersCurrenciesRepository.findUsersDefault(
      userId,
    );

    if (!usersDefault) {
      throw new DefaultCurrencyNotFoundException();
    }

    return usersDefault;
  }

  async findAndValidateUsersCurrency(
    idOrName: number | string,
    userId: number,
  ): Promise<UsersCurrencies & { currency: Currency }> {
    let usersCurrency: (UsersCurrencies & { currency: Currency }) | null;
    if (typeof idOrName === 'string') {
      usersCurrency = await this.usersCurrenciesRepository.findByName(
        idOrName,
        userId,
      );
    } else {
      usersCurrency = await this.usersCurrenciesRepository.findById(
        idOrName,
        userId,
      );
    }

    if (!usersCurrency) {
      throw new CurrencyNotAddedException(idOrName);
    }

    return usersCurrency;
  }
}
