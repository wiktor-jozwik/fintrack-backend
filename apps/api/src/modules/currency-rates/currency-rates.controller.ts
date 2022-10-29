import { Controller, Get, Query } from '@nestjs/common';
import { Public, SkipUserActiveCheck } from '@api/common/decorators';
import { CurrencyRatesService } from '@api/modules/currency-rates/currency-rates.service';
import { SearchCurrencyRatesDto } from '@api/modules/currency-rates/dto/search-currency-rates.dto';

@Controller('currency_rates')
export class CurrencyRatesController {
  constructor(private readonly currencyRatesService: CurrencyRatesService) {}

  @SkipUserActiveCheck()
  @Public()
  @Get()
  findAll(@Query() query: SearchCurrencyRatesDto) {
    return this.currencyRatesService.findAll(query);
  }
}
