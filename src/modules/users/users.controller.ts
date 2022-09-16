import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TokenDto } from './dto/token.dto';
import { UsersService } from './users.service';
import { ResendActivationLinkDto } from './dto/resend-activation-link.dto';
import { Public } from '../../common/decorators/public';
import { AcceptNotActiveUser } from '../../common/decorators/accept-not-active-user';
import { StringResponse } from '../../common/interfaces/string-response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AcceptNotActiveUser()
  @Public()
  @Get('confirm_email')
  async confirmEmail(@Query() query: TokenDto): Promise<StringResponse> {
    await this.usersService.confirmEmail(query.token);

    return { response: `Successfully activated account!` };
  }

  @AcceptNotActiveUser()
  @Public()
  @Post('resend_activation_email')
  async resendActivationEmail(
    @Body() resendActivationLinkDto: ResendActivationLinkDto,
  ): Promise<StringResponse> {
    const email = await this.usersService.resendActivationEmail(
      resendActivationLinkDto.email,
    );

    return { response: `Email with instructions sent to: ${email}` };
  }
}
