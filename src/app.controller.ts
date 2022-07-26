import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from './modules/auth/auth-request';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Req() req: AuthRequest) {
    return req.user;
  }
}
