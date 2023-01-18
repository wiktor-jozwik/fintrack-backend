import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersRepository } from '@app/database';
import { hashString } from '@app/common/utils';
import { JwtTokens } from '../interfaces';
import { UserEmailPayload } from '@app/common/interfaces';
import { AuthValidatorService } from './auth-validator.service';
import { UsersValidatorService } from '../../users/services';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authValidatorService: AuthValidatorService,
    private readonly usersValidatorService: UsersValidatorService,
    private readonly tokenService: TokenService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async validateUser(email: string, plainTextPassword: string): Promise<User> {
    return await this.authValidatorService.validateUserCredentials(
      email,
      plainTextPassword,
    );
  }

  async login(userEmailPayload: UserEmailPayload): Promise<JwtTokens> {
    const user = await this.usersValidatorService.findAndValidateUser(
      userEmailPayload.email,
    );

    const tokens = await this.tokenService.generateTokens({
      id: userEmailPayload.id,
      email: userEmailPayload.email,
      isActive: user.isActive,
    });

    await this.updateRefreshToken(user.id, tokens.jwtRefreshToken);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.usersRepository.updateById(userId, { refreshTokenHash: null });
    return true;
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<JwtTokens> {
    const user = await this.authValidatorService.validateUserRefreshToken(
      userId,
      refreshToken,
    );

    const tokens = await this.login({ id: user.id, email: user.email });
    await this.updateRefreshToken(user.id, tokens.jwtRefreshToken);

    return tokens;
  }

  private async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User> {
    const refreshTokenHash = await hashString(refreshToken);

    return await this.usersRepository.updateById(userId, { refreshTokenHash });
  }
}
