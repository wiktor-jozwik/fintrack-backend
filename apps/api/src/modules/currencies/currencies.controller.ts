import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { Public, SkipUserActiveCheck } from '@api/common/decorators';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @SkipUserActiveCheck()
  @Public()
  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }
}
