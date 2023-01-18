import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  InvalidCredentialsException,
  PasswordsDoNotMatchException,
  UserAlreadyActiveException,
  UserAlreadyExistsException,
} from '@app/common/exceptions';
import { UsersRepository } from '@app/database';
import { UserRegisterDto } from '../dto';

@Injectable()
export class UsersValidatorService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAndValidateUser(idOrEmail: number | string): Promise<User> {
    let user: User | null;
    if (typeof idOrEmail === 'string') {
      user = await this.usersRepository.findByEmail(idOrEmail);
    } else {
      user = await this.usersRepository.findById(idOrEmail);
    }

    if (!user) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  async validateRegisterData(userData: UserRegisterDto): Promise<void> {
    const { email, password, passwordConfirmation } = userData;
    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      throw new UserAlreadyExistsException(email);
    }
    if (password !== passwordConfirmation) {
      throw new PasswordsDoNotMatchException();
    }
  }

  async checkIfUserAlreadyActive(email: string) {
    const user = await this.findAndValidateUser(email);

    if (user.isActive) {
      throw new UserAlreadyActiveException(email);
    }
  }
}
