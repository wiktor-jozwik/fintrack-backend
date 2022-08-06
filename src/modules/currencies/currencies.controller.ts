import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Public } from '../../decorators/public';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Public()
  @Get('public')
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get()
  findUserAll() {
    return this.currenciesService.findUserAll();
  }

  @Get('default')
  findDefault() {
    return this.currenciesService.findDefault();
  }

  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }
}
