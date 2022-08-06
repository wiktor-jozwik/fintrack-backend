import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserPayloadInterface } from './user-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../../database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
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
