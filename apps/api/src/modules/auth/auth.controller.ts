import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import {
  Public,
  RefreshToken,
  SkipUserActiveCheck,
  UserId,
} from '@api/common/decorators';
import { UserRegisterInterceptor } from './interceptors';
import { UserRegisterDto } from '../users/dto';
import { JwtRefreshTokenGuard, LocalAuthGuard } from '@api/common/guards';
import { AuthRequest, JwtTokens, LogoutResponse } from './interfaces';

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
