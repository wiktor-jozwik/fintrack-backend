import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredException } from '@app/common/exceptions';

@Injectable()
export class MailTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateEmailConfirmationToken(email: string): string {
    return this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('JWT_USER_EMAILS_TOKEN_SECRET'),
        expiresIn: this.configService.get(
          'JWT_USER_EMAILS_TOKEN_EXPIRATION_TIME',
        ),
      },
    );
  }

  async decodeConfirmationToken(token: string): Promise<string> {
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
