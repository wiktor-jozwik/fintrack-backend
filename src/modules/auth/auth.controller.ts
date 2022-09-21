import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthRequest } from './interfaces/auth-request';
import { UsersService } from '../users/users.service';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public';
import { UserRegisterInterceptor } from './interceptors/user-register.interceptor';
import { SkipUserActiveCheck } from '../../common/decorators/skip-user-active-check';
import { User } from '@prisma/client';
import { JwtTokens } from './interfaces/jwt-tokens';
import { UserId } from '../../common/decorators/user-id';
import { JwtRefreshTokenGuard } from '../../common/guards/jwt-refresh-token.guard';
import { RefreshToken } from '../../common/decorators/refresh-token';
import { LogoutResponse } from './interfaces/logout-response';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseInterceptors(UserRegisterInterceptor)
  @Public()
  @SkipUserActiveCheck()
  @Post('register')
  async register(@Body() userRegisterData: UserRegisterDto): Promise<User> {
    return await this.usersService.register(userRegisterData);
  }

  @Public()
  @SkipUserActiveCheck()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: AuthRequest): Promise<JwtTokens> {
    return this.authService.login(req.user);
  }

  @Delete('logout')
  async logout(@UserId() userId: number): Promise<LogoutResponse> {
    const logoutResponse = await this.authService.logout(userId);
    return { success: logoutResponse };
  }

  @Public()
  @SkipUserActiveCheck()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @UserId() userId: number,
    @RefreshToken() refreshToken: string,
  ): Promise<JwtTokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
