import { Controller, Get, Query } from '@nestjs/common';
import { Public, SkipUserActiveCheck } from '@api/common/decorators';
import { CurrencyRatesService } from '@api/modules/currency-rates/currency-rates.service';
import { SearchCurrencyRatesDto } from '@api/modules/currency-rates/dto/search-currency-rates.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyRateValueOnDateResponse } from '@api/modules/currency-rates/responses';

@ApiTags('currencies')
@Controller('currency_rates')
export class CurrencyRatesController {
  constructor(private readonly currencyRatesService: CurrencyRatesService) {}

  @ApiOkResponse({
    type: [CurrencyRateValueOnDateResponse],
  })
  @SkipUserActiveCheck()
  @Public()
  @Get()
  findAll(
    @Query() query: SearchCurrencyRatesDto,
  ): Promise<CurrencyRateValueOnDateResponse[]> {
    return this.currencyRatesService.findAll(query);
  }
}
