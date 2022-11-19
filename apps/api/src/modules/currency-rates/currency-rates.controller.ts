import { Controller, Get, Query } from '@nestjs/common';
import { Public, SkipUserActiveCheck } from '../../common/decorators';
import { CurrencyRatesService } from '../../modules/currency-rates/currency-rates.service';
import { SearchCurrencyRatesDto } from '../../modules/currency-rates/dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyRateValueOnDateResponse } from '../../modules/currency-rates/responses';

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
