import { Injectable } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { hashString } from '../../common/utils/hash-password';
import { User } from '@prisma/client';
import { UsersCurrenciesService } from '../users-currencies/users-currencies.service';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { PasswordsDoNotMatchException } from './exceptions/passwords-do-not-match.exception';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersCurrenciesService: UsersCurrenciesService,
  ) {}

  async register(registerData: UserRegisterDto): Promise<User> {
    await this.validateRegisterData(registerData);

    const hashedPassword = await hashString(registerData.password);
    const currency = await this.usersCurrenciesService.findSupportedCurrency(
      registerData.defaultCurrencyName,
    );

    const { firstName, lastName, phoneNumber, email } = registerData;

    const user = await this.usersRepository.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    await this.usersCurrenciesService.createUsersCurrency(currency, user.id);

    return user;
  }

  private async validateRegisterData(userData: UserRegisterDto) {
    const { email, password, passwordConfirmation } = userData;
    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      throw new UserAlreadyExistsException(email);
    }
    if (password !== passwordConfirmation) {
      throw new PasswordsDoNotMatchException();
    }
  }
}
