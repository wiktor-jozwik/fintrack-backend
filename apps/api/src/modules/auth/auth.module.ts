import { Module } from '@nestjs/common';
import { AuthService, AuthValidatorService, TokenService } from './services';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersRepository } from '@app/database';
import {
  JwtAccessTokenStrategy,
  JwtRefreshTokenStrategy,
  LocalStrategy,
} from './strategies';
import { UsersModule } from '../users';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessTokenGuard, UserIsActiveGuard } from '../../common/guards';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthValidatorService,
    TokenService,
    LocalStrategy,
    JwtRefreshTokenStrategy,
    UsersRepository,
    JwtAccessTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserIsActiveGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
