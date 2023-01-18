import { Injectable } from '@nestjs/common';
import { UserPayload } from '@app/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokens } from '../interfaces';

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
      this.jwtService.signAsync(
        {
          id: payload.id,
          email: payload.email,
        },
        {
          secret: this.configService.get('JWT_RT_SECRET'),
          expiresIn: this.configService.get('JWT_RT_EXPIRATION_TIME'),
        },
      ),
    ]);

    return {
      jwtAccessToken,
      jwtRefreshToken,
    };
  }
}
