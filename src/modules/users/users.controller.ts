import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TokenDto } from './dto/token.dto';
import { UsersService } from './users.service';
import { ResendActivationLinkDto } from './dto/resend-activation-link.dto';
import { Public } from '../../common/decorators/public';
import { AcceptNotActiveUser } from '../../common/decorators/accept-not-active-user';
import { StringResponse } from '../../common/interfaces/string-response';
import { UserId } from '../../common/decorators/user-id';
import { UserProfileResponse } from './interfaces/user-profile-response';
import { UserProfileInterceptor } from './interceptors/user-profile.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(UserProfileInterceptor)
  @Get('profile')
  async getProfileData(@UserId() userId: number): Promise<UserProfileResponse> {
    return await this.usersService.getProfileData(userId);
  }

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
