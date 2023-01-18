import { numberStub } from '../stubs/number.stub';

export const NbpHttpServiceMock = {
  fetchCurrencyRateForDate: jest.fn().mockResolvedValue(numberStub()),
};
