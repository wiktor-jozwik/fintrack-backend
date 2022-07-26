import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserPayloadInterface } from './strategies/user.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new HttpException(
        `User ${email} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      user.password,
    );

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
