import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../../modules/users';
import { AuthService } from './auth.service';
import { RefreshToken } from '../../common/decorators';
import { UserRegisterInterceptor } from './interceptors';
import { UserLoginDto, UserRegisterDto } from '../users/dto';
import { JwtRefreshTokenGuard, LocalAuthGuard } from '../../common/guards';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  JwtTokensResponse,
  LogoutResponse,
} from '../../modules/auth/responses';
import { Public, SkipUserActiveCheck, UserId } from '../../common/decorators';
import { AuthRequest } from '@app/common/interfaces';
import { UserEntity } from '../../common/entities';

@ApiTags('users')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    console.log('auth controller');
  }

  @UseInterceptors(UserRegisterInterceptor)
  @Public()
  @SkipUserActiveCheck()
  @Post('register')
  async register(
    @Body() userRegisterData: UserRegisterDto,
  ): Promise<UserEntity> {
    return await this.usersService.register(userRegisterData);
  }

  @ApiBody({ type: UserLoginDto })
  @ApiOkResponse({ type: JwtTokensResponse })
  @Public()
  @SkipUserActiveCheck()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: AuthRequest): Promise<JwtTokensResponse> {
    return this.authService.login(req.user);
  }

  @ApiOkResponse({ type: LogoutResponse })
  @Delete('logout')
  async logout(@UserId() userId: number): Promise<LogoutResponse> {
    const logoutResponse = await this.authService.logout(userId);
    return { success: logoutResponse };
  }

  @ApiCreatedResponse({ type: JwtTokensResponse })
  @Public()
  @SkipUserActiveCheck()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @UserId() userId: number,
    @RefreshToken() refreshToken: string,
  ): Promise<JwtTokensResponse> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
