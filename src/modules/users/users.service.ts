import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../../database/entities/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import * as Joi from '@hapi/joi';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerData: UserRegisterDto): Promise<User> {
    await this.validateRegisterData(registerData);

    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    return await this.userRepository.save({
      ...registerData,
      password: hashedPassword,
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async validateRegisterData(userData: UserRegisterDto) {
    const registerUserSchema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      passwordConfirmation: Joi.string().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      phoneNumber: Joi.string(),
    });

    const validation = registerUserSchema.validate(userData);

    if (validation.error) {
      throw new HttpException(
        validation.error.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { email, password, passwordConfirmation } = userData;
    const user = await this.getByEmail(email);
    if (user) {
      throw new HttpException(
        `User with ${email} email already exists`,
        HttpStatus.CONFLICT,
      );
    }
    if (password !== passwordConfirmation) {
      throw new HttpException(
        'Passwords do not match',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
