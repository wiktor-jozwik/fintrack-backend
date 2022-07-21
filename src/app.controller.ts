import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthRequest } from './modules/auth/auth-request';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Req() req: AuthRequest) {
    return req.user;
  }
}
