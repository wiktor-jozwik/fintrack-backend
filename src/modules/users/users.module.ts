import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersCurrenciesModule } from '../users-currencies/users-currencies.module';

@Module({
  imports: [PrismaModule, UsersCurrenciesModule],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
