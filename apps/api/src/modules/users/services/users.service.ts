import { Injectable } from '@nestjs/common';
import { hashString } from '@app/common/utils';
import { User } from '@prisma/client';
import { UsersRepository } from '@app/database';
import { UserRegisterDto } from '../dto';
import { UserProfileResponse } from '../responses';
import {
  UsersCurrenciesService,
  UsersCurrenciesValidatorService,
} from '../../users-currencies/services';
import { UsersValidatorService } from './users-validator.service';
import { CurrenciesValidatorService } from '../../currencies/services';
import { UsersMailerService } from './users-mailer.service';
import { MailTokenService } from './mail-token.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersValidatorService: UsersValidatorService,
    private readonly usersCurrenciesValidatorService: UsersCurrenciesValidatorService,
    private readonly currenciesValidatorService: CurrenciesValidatorService,
    private readonly usersMailerService: UsersMailerService,
    private readonly mailTokenService: MailTokenService,
    private readonly usersCurrenciesService: UsersCurrenciesService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async register(registerData: UserRegisterDto): Promise<User> {
    await this.usersValidatorService.validateRegisterData(registerData);

    const passwordHash = await hashString(registerData.password);
    const currency =
      await this.currenciesValidatorService.findAndValidateCurrency(
        registerData.defaultCurrencyName,
      );

    const { firstName, lastName, phoneNumber, email } = registerData;

    const user = await this.usersRepository.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      passwordHash,
    });
    await this.usersCurrenciesService.createUsersCurrency(currency, user.id);

    this.sendActivationMail(email);

    return user;
  }

  async getProfileData(userId: number): Promise<UserProfileResponse> {
    const [user, defaultUsersCurrency] = await Promise.all([
      this.usersValidatorService.findAndValidateUser(userId),
      this.usersCurrenciesValidatorService.findAndValidateUsersDefaultCurrency(
        userId,
      ),
    ]);

    const defaultCurrency = defaultUsersCurrency.currency;

    return { user, defaultCurrency };
  }

  async confirmEmail(token: string) {
    const email = await this.mailTokenService.decodeConfirmationToken(token);
    await this.usersValidatorService.checkIfUserAlreadyActive(email);

    await this.usersRepository.updateByEmail(email, { isActive: true });
  }

  async resendActivationEmail(email: string): Promise<string> {
    await this.usersValidatorService.checkIfUserAlreadyActive(email);

    this.sendActivationMail(email);

    return email;
  }

  private sendActivationMail(email: string) {
    const token = this.mailTokenService.generateEmailConfirmationToken(email);
    this.usersMailerService.sendActivationMail(email, token);
  }
}
