import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesController } from '../../../src/modules/currencies/currencies.controller';
import { CurrenciesService } from '../../../src/modules/currencies/currencies.service';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [CurrenciesService],
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
