import { categoryStub } from '@app/database/repositories/test/stubs/category.stub';

export const CategoriesRepositoryMock = {
  create: jest.fn().mockResolvedValue(categoryStub()),
  findById: jest.fn().mockResolvedValue(categoryStub()),
  findByName: jest.fn().mockResolvedValue(categoryStub()),
  findByNameAndType: jest.fn().mockResolvedValue(categoryStub()),
  findAll: jest.fn().mockResolvedValue([categoryStub()]),
  update: jest.fn().mockResolvedValue(categoryStub()),
  delete: jest.fn().mockResolvedValue(categoryStub()),
};
