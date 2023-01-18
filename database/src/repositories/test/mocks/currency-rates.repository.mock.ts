import { currencyRateStub } from '@app/database/repositories/test/stubs/currency-rate.stub';

export const CurrencyRatesRepositoryMock = {
  findCurrencyRatesForDates: jest.fn().mockResolvedValue([currencyRateStub()]),
  countCurrency: jest.fn().mockResolvedValue(10),
  findCurrencyRateForDate: jest.fn().mockResolvedValue(currencyRateStub()),
  create: jest.fn().mockResolvedValue(currencyRateStub()),
};
