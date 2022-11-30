import { currencyStub } from '../stubs';

export const CurrenciesRepositoryMock = {
  findAll: jest.fn().mockResolvedValue([currencyStub()]),
  findByName: jest.fn().mockResolvedValue(currencyStub()),
  count: jest.fn().mockResolvedValue(1),
  upsert: jest.fn().mockResolvedValue(currencyStub()),
};
