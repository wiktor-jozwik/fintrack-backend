import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './interfaces/user.payload';
import { compareHash } from '../../common/utils/compare-hash';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';
import { AccountNotActiveException } from './exceptions/account-not-active.exception';
import { hashString } from '../../common/utils/hash-password';
import { User } from '@prisma/client';
import { JwtTokens } from './interfaces/jwt-tokens';
import { ConfigService } from '@nestjs/config';
import { UserEmailPayload } from './interfaces/user-email.payload';
import { UsersRepository } from '@app/database';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

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

  async login(userEmailPayload: UserEmailPayload): Promise<JwtTokens> {
    const user = await this.usersRepository.findByEmail(userEmailPayload.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const tokens = await this.generateTokens({
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
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new InvalidCredentialsException();
    }

    const doesRefreshTokenMatch = await compareHash(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!doesRefreshTokenMatch) {
      throw new InvalidCredentialsException();
    }

    const tokens = await this.login({ id: user.id, email: user.email });

    await this.updateRefreshToken(user.id, tokens.jwtRefreshToken);

    return tokens;
  }

  private async generateTokens(payload: UserPayload): Promise<JwtTokens> {
    const [jwtAccessToken, jwtRefreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_AT_SECRET'),
        expiresIn: this.configService.get('JWT_AT_EXPIRATION_TIME'),
      }),
      this.generateRefreshToken({
        id: payload.id,
        email: payload.email,
      }),
    ]);

    return {
      jwtAccessToken,
      jwtRefreshToken,
    };
  }

  private async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User> {
    const refreshTokenHash = await hashString(refreshToken);

    return await this.usersRepository.updateById(userId, { refreshTokenHash });
  }

  private async generateRefreshToken(
    userEmailPayload: UserEmailPayload,
  ): Promise<string> {
    return await this.jwtService.signAsync(userEmailPayload, {
      secret: this.configService.get('JWT_RT_SECRET'),
      expiresIn: this.configService.get('JWT_RT_EXPIRATION_TIME'),
    });
  }
}
