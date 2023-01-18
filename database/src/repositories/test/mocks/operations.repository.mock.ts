import {
  categoryStub,
  currencyStub,
  operationStub,
} from '@app/database/repositories/test/stubs';

export const OperationsRepositoryMock = {
  findAll: jest.fn().mockResolvedValue([
    {
      ...operationStub(),
      currency: currencyStub(),
      category: categoryStub(),
    },
  ]),
  findById: jest.fn().mockResolvedValue(operationStub()),
  findByReferentialNumberAndOrigin: jest.fn().mockResolvedValue(null),
  findManyByCategoryId: jest
    .fn()
    .mockResolvedValue([{ ...operationStub(), category: categoryStub() }]),
  create: jest.fn().mockResolvedValue(operationStub()),
  update: jest.fn().mockResolvedValue(operationStub()),
  delete: jest.fn().mockResolvedValue(operationStub()),
};
