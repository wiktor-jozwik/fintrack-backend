export const CurrencyFetchServiceMock = {
  saveCurrencyForDate: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve()),
  checkIfAllCurrenciesAreMigrated: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve()),
  checkIfThereIsRateToFetch: jest.fn().mockResolvedValue(true),
};
