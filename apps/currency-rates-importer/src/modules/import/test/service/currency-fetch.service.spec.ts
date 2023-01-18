import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyFetchService, NbpHttpService } from '../../services';
import * as moment from 'moment';
import { CurrenciesRepository, CurrencyRatesRepository } from '@app/database';
import {
  CurrenciesRepositoryMock,
  CurrencyRatesRepositoryMock,
} from '@app/database/repositories/test/mocks';
import { NbpHttpServiceMock } from '../mocks/nbp-http.service.mock';

describe('CurrencyFetchService', () => {
  let currencyFetchService: CurrencyFetchService;
  let nbpHttpService: NbpHttpService;
  let currencyRatesRepository: CurrencyRatesRepository;
  let currenciesRepository: CurrenciesRepository;

  const nbpHttpServiceMock = NbpHttpServiceMock;
  const currencyRatesRepositoryMock = CurrencyRatesRepositoryMock;
  const currenciesRepositoryMock = CurrenciesRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyFetchService,
        NbpHttpService,
        CurrencyRatesRepository,
        CurrenciesRepository,
      ],
    })
      .overrideProvider(NbpHttpService)
      .useValue(nbpHttpServiceMock)
      .overrideProvider(CurrencyRatesRepository)
      .useValue(currencyRatesRepositoryMock)
      .overrideProvider(CurrenciesRepository)
      .useValue(currenciesRepositoryMock)
      .compile();

    currencyFetchService =
      module.get<CurrencyFetchService>(CurrencyFetchService);
    nbpHttpService = module.get<NbpHttpService>(NbpHttpService);
    currencyRatesRepository = module.get<CurrencyRatesRepository>(
      CurrencyRatesRepository,
    );
    currenciesRepository =
      module.get<CurrenciesRepository>(CurrenciesRepository);

    jest.clearAllMocks();
  });

  describe('saveCurrencyForDate', () => {
    describe('when saveCurrencyForDate is called', () => {
      const defaultFindCurrencyRateForDate =
        currencyRatesRepositoryMock.findCurrencyRateForDate;

      beforeAll(() => {
        currencyRatesRepositoryMock.findCurrencyRateForDate = jest
          .fn()
          .mockResolvedValue(null);
      });

      afterAll(() => {
        currencyRatesRepositoryMock.findCurrencyRateForDate =
          defaultFindCurrencyRateForDate;
      });

      const name = 'USD';
      const isoDate = '2022-05-05';
      const date = moment(isoDate);

      beforeEach(async () => {
        await currencyFetchService.saveCurrencyForDate(name, date);
      });

      it('should call currencyRatesRepository', () => {
        expect(currencyRatesRepository.findCurrencyRateForDate).toBeCalledWith(
          name,
          new Date(isoDate),
        );
      });

      it('should call nbpHttpService', () => {
        expect(nbpHttpService.fetchCurrencyRateForDate).toBeCalledWith(
          name,
          isoDate,
        );
      });

      it('should call currencyRatesRepository', () => {
        expect(currencyRatesRepository.create).toBeCalled();
      });
    });
  });

  describe('checkIfAllCurrenciesAreMigrated', () => {
    describe('when checkIfAllCurrenciesAreMigrated is called', () => {
      beforeEach(async () => {
        await currencyFetchService.checkIfAllCurrenciesAreMigrated();
      });

      it('should call currenciesRepository', () => {
        expect(currenciesRepository.count).toBeCalled();
      });

      it('should call currenciesRepository', () => {
        expect(currenciesRepository.upsert).toBeCalled();
      });
    });
  });
});
