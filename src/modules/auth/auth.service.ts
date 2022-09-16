import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './interfaces/user.payload';
import { compareHash } from '../../common/utils/compare-hash';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';
import { UsersRepository } from '../users/users.repository';
import { AccountNotActiveException } from './exceptions/account-not-active.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
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
      user.password,
    );

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  async login(user: UserPayload) {
    return {
      jwtToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        isActive: user.isActive,
      }),
    };
  }
}
