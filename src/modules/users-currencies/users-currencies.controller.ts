import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersCurrenciesService } from './users-currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UserId } from '../../common/decorators/user-id';

@Controller('users_currencies')
export class UsersCurrenciesController {
  constructor(
    private readonly usersCurrenciesService: UsersCurrenciesService,
  ) {}

  @Get()
  findAll(@UserId() userId: number) {
    return this.usersCurrenciesService.findAll(userId);
  }

  @Get('default')
  findDefault(@UserId() userId: number) {
    return this.usersCurrenciesService.findDefault(userId);
  }

  @Post()
  create(
    @Body() createCurrencyDto: CreateCurrencyDto,
    @UserId() userId: number,
  ) {
    return this.usersCurrenciesService.create(createCurrencyDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) currencyId: number,
    @UserId() userId: number,
  ) {
    return this.usersCurrenciesService.remove(currencyId, userId);
  }
}
