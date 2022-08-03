import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../../database/entities/user.entity';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CurrenciesModule],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
