import { Injectable } from '@nestjs/common';
import {
  AccountNotActiveException,
  InvalidCredentialsException,
} from '@app/common/exceptions';
import { compareHash } from '@app/common/utils';
import { User } from '@prisma/client';
import { UsersValidatorService } from '../../users/services';

@Injectable()
export class AuthValidatorService {
  constructor(private readonly usersValidatorService: UsersValidatorService) {}
  async validateUserCredentials(
    email: string,
    plainTextPassword: string,
  ): Promise<User> {
    const user = await this.usersValidatorService.findAndValidateUser(email);

    if (!user.isActive) {
      throw new AccountNotActiveException();
    }

    const doesPasswordMatch = await compareHash(
      plainTextPassword,
      user.passwordHash,
    );

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  async validateUserRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.usersValidatorService.findAndValidateUser(userId);
    if (!user.refreshTokenHash) {
      throw new InvalidCredentialsException();
    }

    const doesRefreshTokenMatch = await compareHash(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!doesRefreshTokenMatch) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
}
