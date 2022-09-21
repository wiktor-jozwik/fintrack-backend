import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { Public } from '../../common/decorators/public';
import { SkipUserActiveCheck } from '../../common/decorators/skip-user-active-check';

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
