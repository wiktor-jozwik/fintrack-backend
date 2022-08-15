import { Module } from '@nestjs/common';
import { UsersCurrenciesService } from './users-currencies.service';
import { UsersCurrenciesController } from './users-currencies.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersCurrenciesController],
  providers: [UsersCurrenciesService],
  exports: [UsersCurrenciesService],
})
export class UsersCurrenciesModule {}
