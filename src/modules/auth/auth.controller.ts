import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from './auth-request';
import { UsersService } from '../users/users.service';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: AuthRequest) {
    if (req.user) {
      return this.authService.login(req.user);
    }
    return null;
  }

  @Public()
  @Post('register')
  async register(@Body() userRegisterData: UserRegisterDto) {
    return await this.usersService.register(userRegisterData);
  }
}
