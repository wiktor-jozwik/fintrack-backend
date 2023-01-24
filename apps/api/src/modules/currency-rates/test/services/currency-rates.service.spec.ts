import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyRatesRepository } from '@app/database';
import { CurrencyRate } from '@prisma/client';
import { CurrencyRatesService } from '../../services';
import { CurrencyRatesRepositoryMock } from '@app/database/repositories/test/mocks/currency-rates.repository.mock';
import { CurrencyRateValueOnDateResponse } from '../../responses';
import { SearchCurrencyRatesDto } from '../../dto';

describe('CurrencyRatesService', () => {
  let currencyRatesService: CurrencyRatesService;
  let currencyRatesRepository: CurrencyRatesRepository;
  const currencyRatesRepositoryMock = CurrencyRatesRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyRatesService, CurrencyRatesRepository],
    })
      .overrideProvider(CurrencyRatesRepository)
      .useValue(currencyRatesRepositoryMock)
      .compile();

    currencyRatesService =
      module.get<CurrencyRatesService>(CurrencyRatesService);
    currencyRatesRepository = module.get<CurrencyRatesRepository>(
      CurrencyRatesRepository,
    );

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    describe('when findAll is called & currency == DEFAULT_APP_CURRENCY', () => {
      const defaultFindCurrencyRatesForDates =
        currencyRatesRepositoryMock.findCurrencyRatesForDates;

      const currencyRates: CurrencyRate[] = [
        {
          id: 3,
          currencyId: 3,
          date: new Date('2022-01-01'),
          avgValue: 4.25,
        },
        {
          id: 4,
          currencyId: 3,
          date: new Date('2022-01-02'),
          avgValue: 4.3,
        },
        {
          id: 5,
          currencyId: 3,
          date: new Date('2022-01-03'),
          avgValue: 4.35,
        },
      ];

      beforeAll(() => {
        currencyRatesRepositoryMock.findCurrencyRatesForDates = jest
          .fn()
          .mockResolvedValue(currencyRates);
      });
      afterAll(() => {
        currencyRatesRepositoryMock.findCurrencyRatesForDates =
          defaultFindCurrencyRatesForDates;
      });

      let currencyRateValueOnDate: CurrencyRateValueOnDateResponse[];

      const query: SearchCurrencyRatesDto = {
        baseCurrency: 'USD',
        currency: 'PLN',
        startDate: '2022-01-01',
        endDate: '2022-01-03',
      };

      beforeEach(async () => {
        currencyRateValueOnDate = await currencyRatesService.findAll(query);
      });

      it('should call currencyRatesRepository', () => {
        expect(
          currencyRatesRepository.findCurrencyRatesForDates,
        ).toBeCalledWith(query.baseCurrency, query.startDate, query.endDate);
      });

      it('should return an array', () => {
        expect(currencyRateValueOnDate).toBeInstanceOf(Array);
      });

      it('should return values of currency on dates', () => {
        currencyRates.forEach((currencyRate, index) => {
          expect(currencyRateValueOnDate[index].value).toBeCloseTo(
            1 / currencyRate.avgValue,
          );
        });
      });
    });

    describe('when findAll is called when baseCurrency == DEFAULT_APP_CURRENCY', () => {
      const defaultFindCurrencyRatesForDates =
        currencyRatesRepositoryMock.findCurrencyRatesForDates;

      const currencyRates: CurrencyRate[] = [
        {
          id: 3,
          currencyId: 3,
          date: new Date('2022-01-01'),
          avgValue: 4.25,
        },
        {
          id: 4,
          currencyId: 3,
          date: new Date('2022-01-02'),
          avgValue: 4.3,
        },
        {
          id: 5,
          currencyId: 3,
          date: new Date('2022-01-03'),
          avgValue: 4.35,
        },
      ];

      beforeAll(() => {
        currencyRatesRepositoryMock.findCurrencyRatesForDates = jest
          .fn()
          .mockResolvedValue(currencyRates);
      });
      afterAll(() => {
        currencyRatesRepositoryMock.findCurrencyRatesForDates =
          defaultFindCurrencyRatesForDates;
      });

      let currencyRateValueOnDate: CurrencyRateValueOnDateResponse[];

      const query: SearchCurrencyRatesDto = {
        baseCurrency: 'PLN',
        currency: 'USD',
        startDate: '2022-01-01',
        endDate: '2022-01-03',
      };

      beforeEach(async () => {
        currencyRateValueOnDate = await currencyRatesService.findAll(query);
      });

      it('should call currencyRatesRepository', () => {
        expect(
          currencyRatesRepository.findCurrencyRatesForDates,
        ).toBeCalledWith(query.currency, query.startDate, query.endDate);
      });

      it('should return an array', () => {
        expect(currencyRateValueOnDate).toBeInstanceOf(Array);
      });

      it('should return values of currency on dates', () => {
        currencyRates.forEach((currencyRate, index) => {
          expect(currencyRateValueOnDate[index].value).toBeCloseTo(
            currencyRate.avgValue,
          );
        });
      });
    });
  });
});
