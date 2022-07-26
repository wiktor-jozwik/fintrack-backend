import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthRequest } from './auth-request';
import { UsersService } from '../users/users.service';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() userRegisterData: UserRegisterDto) {
    return await this.usersService.register(userRegisterData);
  }
}
