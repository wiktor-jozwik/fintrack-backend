import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCurrenciesModule } from '../users-currencies/users-currencies.module';
import { UsersController } from './users.controller';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from '@app/database';

@Module({
  imports: [ConfigModule, JwtModule, UsersCurrenciesModule, EmailModule],
  exports: [UsersService],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
