import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersRepository } from '@app/database';
import { JwtRefreshTokenStrategy, LocalStrategy } from './strategies';
import { UsersModule } from '../../modules/users';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtRefreshTokenStrategy,
    UsersRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
