import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from '@app/database';
import { UsersCurrenciesModule } from '@api/modules/users-currencies';
import { EmailModule } from '@api/modules/email';

@Module({
  imports: [JwtModule, ConfigModule, UsersCurrenciesModule, EmailModule],
  exports: [UsersService],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
