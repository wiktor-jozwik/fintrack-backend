import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadInterface } from './user-payload.interface';
import { compareHash } from '../../utils/compare-hash';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordMatching = compareHash(plainTextPassword, user.password);

    if (!isPasswordMatching) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async login(user: UserPayloadInterface) {
    return {
      jwt_token: this.jwtService.sign({ email: user.email, sub: user.id }),
    };
  }
}
