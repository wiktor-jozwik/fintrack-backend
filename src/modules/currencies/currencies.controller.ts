import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get('all')
  findAll() {
    return this.currenciesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findUserAll() {
    return this.currenciesService.findUserAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('default')
  findDefault() {
    return this.currenciesService.findDefault();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }
}
