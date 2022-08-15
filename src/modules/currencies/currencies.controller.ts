import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { Public } from '../../decorators/public';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Public()
  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }
}
