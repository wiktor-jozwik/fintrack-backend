import { categoryStub } from '@app/database/repositories/test/stubs/category.stub';

export const CategoriesValidatorServiceMock = {
  validateNameUniqueness: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve()),
  findAndValidateCategory: jest.fn().mockResolvedValue(categoryStub()),
  validateIfFieldsChanged: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve()),
  validateZeroOperations: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve()),
};
