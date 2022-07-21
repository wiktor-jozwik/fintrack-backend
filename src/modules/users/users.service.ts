import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../../database/entities/user.entity';
import { UserCreateDto } from './dto/user-create.dto';
import Joi from 'joi';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(userData: UserCreateDto): Promise<User> {
    await this.validateRegisterData(userData);

    return await this.userRepository.save(userData);
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async validateRegisterData(userData: UserCreateDto) {
    // const registerUserSchema = Joi.object().keys({
    //   email: Joi.string().email().required(),
    //   password: Joi.string().required(),
    //   passwordConfirmation: Joi.string().required(),
    //   firstName: Joi.string(),
    //   lastName: Joi.string(),
    //   phoneNumber: Joi.string(),
    // });

    // const result = Joi.valid(userData, registerUserSchema);
    // console.log(result);

    // if (result.error) {
    //   throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    // }

    const { email, password, passwordConfirmation } = userData;
    const user = await this.getByEmail(email);
    if (user) {
      throw new HttpException(
        `User with ${email} email already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (password !== passwordConfirmation) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
  }
}
