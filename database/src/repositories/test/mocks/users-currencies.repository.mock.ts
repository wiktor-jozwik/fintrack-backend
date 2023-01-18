import { currencyStub, usersCurrenciesStub } from '../stubs';

export const UsersCurrenciesRepositoryMock = {
  findAll: jest
    .fn()
    .mockResolvedValue([
      { ...usersCurrenciesStub(), currency: currencyStub() },
    ]),
  findById: jest
    .fn()
    .mockResolvedValue({ ...usersCurrenciesStub(), currency: currencyStub() }),
  findByName: jest
    .fn()
    .mockResolvedValue({ ...usersCurrenciesStub(), currency: currencyStub() }),
  create: jest.fn().mockResolvedValue(usersCurrenciesStub()),
  delete: jest.fn().mockImplementationOnce(() => Promise.resolve()),
  findUsersDefault: jest
    .fn()
    .mockResolvedValue({ ...usersCurrenciesStub(), currency: currencyStub() }),
};
