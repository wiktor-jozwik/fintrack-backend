import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyEntity } from '@app/database';
import { Public, SkipUserActiveCheck } from '@app/common/decorators';

@ApiTags('currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @ApiOkResponse({
    type: [CurrencyEntity],
  })
  @SkipUserActiveCheck()
  @Public()
  @Get()
  findAll(): Promise<CurrencyEntity[]> {
    return this.currenciesService.findAll();
  }
}
