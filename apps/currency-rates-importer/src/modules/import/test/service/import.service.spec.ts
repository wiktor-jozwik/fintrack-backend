import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyFetchService, ImportService } from '../../services';
import { CurrencyFetchServiceMock } from '../mocks/currency-fetch.service.mock';
import * as moment from 'moment';
import {
  DEFAULT_APP_CURRENCY,
  FIRST_CURRENCY_RATE_NBP_DATE,
  SUPPORTED_CURRENCIES,
} from '@app/common/constants';

describe('ImportService', () => {
  let importService: ImportService;
  let currencyFetchService: CurrencyFetchService;
  const currencyFetchServiceMock = CurrencyFetchServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportService, CurrencyFetchService],
    })
      .overrideProvider(CurrencyFetchService)
      .useValue(currencyFetchServiceMock)
      .compile();

    importService = module.get<ImportService>(ImportService);
    currencyFetchService =
      module.get<CurrencyFetchService>(CurrencyFetchService);

    jest.clearAllMocks();
  });

  describe('importCurrencyRates', () => {
    describe('when importCurrencyRates is called', () => {
      beforeEach(async () => {
        await importService.importCurrencyRates();
      });

      it('should call importSupportedCurrenciesForDateRange', () => {
        expect(
          currencyFetchService.checkIfAllCurrenciesAreMigrated,
        ).toBeCalled();
      });

      it('should call importSupportedCurrenciesForDateRange', () => {
        const ratesToFetch = importService.PREVIOUS_DAYS_TO_FETCH_AMOUNT + 1;

        // without default currency
        const supporterCurrenciesNumber = SUPPORTED_CURRENCIES.length - 1;
        expect(currencyFetchService.saveCurrencyForDate).toHaveBeenCalledTimes(
          ratesToFetch * supporterCurrenciesNumber,
        );
      });

      for (const currency of SUPPORTED_CURRENCIES) {
        if (currency.name === DEFAULT_APP_CURRENCY) continue;

        it(`should call checkIfThereIsRateToFetch for ${currency.name} currency`, () => {
          expect(currencyFetchService.checkIfThereIsRateToFetch).toBeCalledWith(
            currency.name,
          );
        });
      }
    });
  });

  describe('ensureAllCurrencyRatesImported', () => {
    describe('when ensureAllCurrencyRatesImported is called and shouldFetch is true', () => {
      beforeEach(async () => {
        await importService.ensureAllCurrencyRatesImported();
      });

      it('should call importSupportedCurrenciesForDateRange and import all currency rates', () => {
        const ratesToFetch =
          moment().diff(moment(FIRST_CURRENCY_RATE_NBP_DATE), 'days') + 1;

        // without default currency
        const supporterCurrenciesNumber = SUPPORTED_CURRENCIES.length - 1;
        expect(currencyFetchService.saveCurrencyForDate).toHaveBeenCalledTimes(
          ratesToFetch * supporterCurrenciesNumber,
        );
      });
    });

    describe('when ensureAllCurrencyRatesImported is called and shouldFetch is false', () => {
      const defaultShouldFetch =
        currencyFetchServiceMock.checkIfThereIsRateToFetch;

      beforeAll(() => {
        currencyFetchServiceMock.checkIfThereIsRateToFetch = jest
          .fn()
          .mockResolvedValue(false);
      });
      afterAll(() => {
        currencyFetchServiceMock.checkIfThereIsRateToFetch = defaultShouldFetch;
      });

      beforeEach(async () => {
        await importService.ensureAllCurrencyRatesImported();
      });

      it('should not call importSupportedCurrenciesForDateRange and not import currency rates', () => {
        expect(currencyFetchService.saveCurrencyForDate).toHaveBeenCalledTimes(
          0,
        );
      });
    });
  });
});
