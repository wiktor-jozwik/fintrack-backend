import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersCurrenciesService } from './users-currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Controller('users_currencies')
export class UsersCurrenciesController {
  constructor(
    private readonly usersCurrenciesService: UsersCurrenciesService,
  ) {}

  @Get()
  findAll() {
    return this.usersCurrenciesService.findAll();
  }

  @Get('default')
  findDefault() {
    return this.usersCurrenciesService.findDefault();
  }

  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.usersCurrenciesService.create(createCurrencyDto);
  }
}
