import { userStub } from '@app/database/repositories/test/stubs';

export const AuthValidatorServiceMock = {
  validateUserCredentials: jest.fn().mockResolvedValue(userStub()),
  validateUserRefreshToken: jest.fn().mockResolvedValue(userStub()),
};
