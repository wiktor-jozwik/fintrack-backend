import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { CurrenciesService } from '../currencies/currencies.service';
import { hashString } from '../../utils/hash-password';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  async register(registerData: UserRegisterDto): Promise<User> {
    await this.validateRegisterData(registerData);

    const hashedPassword = await hashString(registerData.password);
    const currency = await this.currenciesService.getSupportedCurrency(
      registerData.defaultCurrencyName,
    );

    const { firstName, lastName, phoneNumber, email } = registerData;

    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        email,
        password: hashedPassword,
      },
    });
    await this.currenciesService.createUserCurrency(currency, user.id);

    return user;
  }

  private async validateRegisterData(userData: UserRegisterDto) {
    const { email, password, passwordConfirmation } = userData;
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (user) {
      throw new HttpException(
        `User with ${email} email already exists`,
        HttpStatus.CONFLICT,
      );
    }
    if (password !== passwordConfirmation) {
      throw new HttpException(
        'Passwords do not match',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
