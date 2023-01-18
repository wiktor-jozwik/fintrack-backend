import { currencyStub } from '@app/database/repositories/test/stubs';

export const CurrenciesValidatorServiceMock = {
  findAndValidateCurrency: jest.fn().mockResolvedValue(currencyStub()),
};
