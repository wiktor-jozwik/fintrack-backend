import { Module } from '@nestjs/common';
import {
  MailTokenService,
  UsersMailerService,
  UsersService,
  UsersValidatorService,
} from './services';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import {
  CurrenciesRepository,
  UsersCurrenciesRepository,
  UsersRepository,
} from '@app/database';
import { UsersCurrenciesModule } from '../users-currencies';
import { EmailModule } from '../email';
import { CurrenciesValidatorService } from '../currencies/services';
import { UsersCurrenciesValidatorService } from '../users-currencies/services';

@Module({
  imports: [JwtModule, ConfigModule, UsersCurrenciesModule, EmailModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersValidatorService,
    MailTokenService,
    UsersMailerService,
    UsersRepository,
    CurrenciesValidatorService,
    UsersCurrenciesValidatorService,
    CurrenciesRepository,
    UsersCurrenciesRepository,
  ],
  exports: [UsersService, UsersValidatorService],
})
export class UsersModule {}
