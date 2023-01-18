import { usersCurrenciesStub } from '@app/database/repositories/test/stubs/users-currencies.stub';
import { currencyStub } from '@app/database/repositories/test/stubs';

export const UsersCurrenciesServiceMock = {
  create: jest.fn().mockResolvedValue(currencyStub()),
  remove: jest.fn().mockResolvedValue(currencyStub()),
  findAll: jest.fn().mockResolvedValue([currencyStub()]),
  findDefault: jest.fn().mockResolvedValue(currencyStub()),
  createUsersCurrency: jest.fn().mockResolvedValue(usersCurrenciesStub()),
};
