import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrenciesModule } from '../currencies/currencies.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, CurrenciesModule],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
