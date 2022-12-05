import { Injectable } from '@nestjs/common';
import { UserEmailPayload, UserPayload } from '@app/common/interfaces';
import { JwtTokens } from '@app/api/src/modules/auth/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: UserPayload): Promise<JwtTokens> {
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

  private async generateRefreshToken(
    userEmailPayload: UserEmailPayload,
  ): Promise<string> {
    return await this.jwtService.signAsync(userEmailPayload, {
      secret: this.configService.get('JWT_RT_SECRET'),
      expiresIn: this.configService.get('JWT_RT_EXPIRATION_TIME'),
    });
  }
}
