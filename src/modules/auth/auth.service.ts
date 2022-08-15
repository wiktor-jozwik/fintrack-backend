import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadInterface } from './user-payload.interface';
import { compareHash } from '../../utils/compare-hash';
import { PrismaService } from '../prisma/prisma.service';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const doesPasswordMatch = await compareHash(
      plainTextPassword,
      user.password,
    );

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  async login(user: UserPayloadInterface) {
    return {
      auth_token: this.jwtService.sign({ email: user.email, sub: user.id }),
    };
  }
}
