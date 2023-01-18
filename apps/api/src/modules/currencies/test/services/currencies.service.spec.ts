import { CurrenciesService } from '../../services';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesRepository } from '@app/database';
import { CurrenciesRepositoryMock } from '@app/database/repositories/test/mocks';
import { Currency } from '@prisma/client';
import { currencyStub } from '@app/database/repositories/test/stubs';

describe('CurrenciesService', () => {
  let currenciesService: CurrenciesService;
  let currenciesRepository: CurrenciesRepository;
  const currenciesRepositoryMock = CurrenciesRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrenciesService, CurrenciesRepository],
    })
      .overrideProvider(CurrenciesRepository)
      .useValue(currenciesRepositoryMock)
      .compile();

    currenciesService = module.get<CurrenciesService>(CurrenciesService);
    currenciesRepository =
      module.get<CurrenciesRepository>(CurrenciesRepository);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let currencies: Currency[];

      beforeEach(async () => {
        currencies = await currenciesService.findAll();
      });

      it('should call currenciesRepository', () => {
        expect(currenciesRepository.findAll).toBeCalled();
      });

      it('should return an array', () => {
        expect(currencies).toBeInstanceOf(Array);
      });

      it('should return currencies', () => {
        expect(currencies).toEqual([currencyStub()]);
      });
    });
  });
});
