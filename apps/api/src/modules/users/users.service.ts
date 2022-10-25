import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { hashString } from '../../common/utils/hash-password';
import { User } from '@prisma/client';
import { UsersCurrenciesService } from '../users-currencies/users-currencies.service';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { PasswordsDoNotMatchException } from './exceptions/passwords-do-not-match.exception';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredException } from './exceptions/token-expired.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserAlreadyActiveException } from './exceptions/user-already-active.exception';
import { UserProfileResponse } from './interfaces/user-profile-response';
import { UsersRepository } from '@app/database';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersCurrenciesService: UsersCurrenciesService,
    private readonly emailService: EmailService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async register(registerData: UserRegisterDto): Promise<User> {
    await this.validateRegisterData(registerData);

    const passwordHash = await hashString(registerData.password);
    const currency = await this.usersCurrenciesService.findSupportedCurrency(
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
    const [user, defaultCurrency] = await Promise.all([
      this.usersRepository.findById(userId),
      this.usersCurrenciesService.findDefault(userId),
    ]);

    if (!user) {
      throw new UserNotFoundException(null);
    }

    return { user, defaultCurrency };
  }

  async confirmEmail(token: string) {
    const email = await this.decodeConfirmationToken(token);
    await this.checkIfUserAlreadyActive(email);

    await this.usersRepository.updateByEmail(email, { isActive: true });
  }

  async resendActivationEmail(email: string): Promise<string> {
    await this.checkIfUserAlreadyActive(email);

    this.sendActivationMail(email);
    return email;
  }

  private sendActivationMail(email: string): void {
    const token = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('JWT_USER_EMAILS_TOKEN_SECRET'),
        expiresIn: this.configService.get(
          'JWT_USER_EMAILS_TOKEN_EXPIRATION_TIME',
        ),
      },
    );

    this.emailService.sendConfirmationEmail(
      email,
      `${this.configService.get('API_URL')}/users/confirm_email?token=${token}`,
    );
  }

  private async checkIfUserAlreadyActive(email: string) {
    const user = await this.findUserOrThrow(email);

    if (user.isActive) {
      throw new UserAlreadyActiveException(email);
    }
  }

  private async findUserOrThrow(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException(email);
    }

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

  private async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_USER_EMAILS_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }
      throw new BadRequestException(error.message);
    }
    throw new InternalServerErrorException(
      'Something went wrong with decoding confirmation token',
    );
  }
}
