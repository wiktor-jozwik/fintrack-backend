import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileInterceptor } from './interceptors';
import { Public, SkipUserActiveCheck, UserId } from '@api/common/decorators';
import { UserProfileResponse } from './interfaces';
import { ResendActivationLinkDto, TokenDto } from './dto';
import { StringResponse } from '@api/common/interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(UserProfileInterceptor)
  @Get('profile')
  async getProfileData(@UserId() userId: number): Promise<UserProfileResponse> {
    return await this.usersService.getProfileData(userId);
  }

  @SkipUserActiveCheck()
  @Public()
  @Get('confirm_email')
  async confirmEmail(@Query() query: TokenDto): Promise<StringResponse> {
    await this.usersService.confirmEmail(query.token);

    return { response: `Successfully activated account!` };
  }

  @SkipUserActiveCheck()
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
