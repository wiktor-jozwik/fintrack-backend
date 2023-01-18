import { usersCurrenciesStub } from '@app/database/repositories/test/stubs/users-currencies.stub';
import { currencyStub } from '@app/database/repositories/test/stubs';

export const UsersCurrenciesValidatorServiceMock = {
  findAndValidateUsersDefaultCurrency: jest
    .fn()
    .mockResolvedValue({ ...usersCurrenciesStub(), currency: currencyStub() }),
  findAndValidateUsersCurrency: jest
    .fn()
    .mockResolvedValue({ ...usersCurrenciesStub(), currency: currencyStub() }),
};
