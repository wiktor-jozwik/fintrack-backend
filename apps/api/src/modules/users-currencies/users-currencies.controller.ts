import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersCurrenciesService } from './users-currencies.service';
import { UserIsActiveGuard } from '@app/common/guards';
import { UserId } from '@app/common/decorators';
import { CreateCurrencyDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyEntity } from '@app/database';

@ApiTags('users_currencies')
@Controller('users_currencies')
export class UsersCurrenciesController {
  constructor(
    private readonly usersCurrenciesService: UsersCurrenciesService,
  ) {}

  @ApiOkResponse({
    type: [CurrencyEntity],
  })
  @UseGuards(UserIsActiveGuard)
  @Get()
  findAll(@UserId() userId: number): Promise<CurrencyEntity[]> {
    return this.usersCurrenciesService.findAll(userId);
  }

  @ApiOkResponse({
    type: [CurrencyEntity],
  })
  @Get('without_default')
  findAllWithoutDefault(@UserId() userId: number): Promise<CurrencyEntity[]> {
    return this.usersCurrenciesService.findAllWithoutDefault(userId);
  }

  @ApiOkResponse({
    type: CurrencyEntity,
  })
  @Get('default')
  findDefault(@UserId() userId: number): Promise<CurrencyEntity> {
    return this.usersCurrenciesService.findDefault(userId);
  }

  @ApiCreatedResponse({
    type: CurrencyEntity,
  })
  @Post()
  create(
    @Body() createCurrencyDto: CreateCurrencyDto,
    @UserId() userId: number,
  ): Promise<CurrencyEntity> {
    return this.usersCurrenciesService.create(createCurrencyDto, userId);
  }

  @ApiOkResponse({
    type: CurrencyEntity,
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) currencyId: number,
    @UserId() userId: number,
  ): Promise<CurrencyEntity> {
    return this.usersCurrenciesService.remove(currencyId, userId);
  }
}
