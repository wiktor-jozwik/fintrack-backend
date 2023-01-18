import { userStub } from '@app/database/repositories/test/stubs';

export const UsersRepositoryMock = {
  findById: jest.fn().mockResolvedValue(userStub()),
  findByEmail: jest.fn().mockResolvedValue(userStub()),
  create: jest.fn().mockResolvedValue(userStub()),
  updateById: jest.fn().mockResolvedValue(userStub()),
  updateByEmail: jest.fn().mockResolvedValue(userStub()),
};
