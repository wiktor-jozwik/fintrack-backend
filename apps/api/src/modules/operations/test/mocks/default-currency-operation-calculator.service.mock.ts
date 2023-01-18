import { operationStub } from '@app/database/repositories/test/stubs';

export const DefaultCurrencyOperationCalculatorServiceMock = {
  getOperationCurrencyRateInDefaultCurrency: jest
    .fn()
    .mockResolvedValue(operationStub().moneyAmount),
};
