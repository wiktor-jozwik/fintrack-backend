import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './services';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public, SkipUserActiveCheck } from '../../common/decorators';
import { CurrencyEntity } from '../../common/entities';

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
    console.log('test api deployment');
    return this.currenciesService.findAll();
  }
}
