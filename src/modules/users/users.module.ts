import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCurrenciesModule } from '../users-currencies/users-currencies.module';
import { UsersRepository } from './users.repository';

@Module({
  imports: [UsersCurrenciesModule],
  exports: [UsersService, UsersRepository],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
