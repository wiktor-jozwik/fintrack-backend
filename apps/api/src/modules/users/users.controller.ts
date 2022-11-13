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
import { ResendActivationLinkDto, TokenDto } from './dto';
import { StringResponse } from '@api/common/types';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileResponse } from '@api/modules/users/responses';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    type: UserProfileResponse,
  })
  @UseInterceptors(UserProfileInterceptor)
  @Get('profile')
  async getProfileData(@UserId() userId: number): Promise<UserProfileResponse> {
    return await this.usersService.getProfileData(userId);
  }

  @ApiOkResponse({
    type: StringResponse,
  })
  @SkipUserActiveCheck()
  @Public()
  @Get('confirm_email')
  async confirmEmail(@Query() query: TokenDto): Promise<StringResponse> {
    await this.usersService.confirmEmail(query.token);

    return { response: `Successfully activated account!` };
  }

  @ApiCreatedResponse({
    type: StringResponse,
  })
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
