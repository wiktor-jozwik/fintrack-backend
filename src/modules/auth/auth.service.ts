import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadInterface } from './user-payload.interface';
import { compareHash } from '../../utils/compare-hash';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';
import { UsersRepository } from '../users/users.repository';

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
      jwtToken: this.jwtService.sign({ email: user.email, sub: user.id }),
    };
  }
}
