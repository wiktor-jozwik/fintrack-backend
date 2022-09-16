import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { Public } from '../../common/decorators/public';
import { AcceptNotActiveUser } from '../../common/decorators/accept-not-active-user';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @AcceptNotActiveUser()
  @Public()
  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }
}
