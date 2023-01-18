import { userStub } from '@app/database/repositories/test/stubs/user.stub';

export const UsersValidatorServiceMock = {
  findAndValidateUser: jest.fn().mockResolvedValue(userStub()),
  validateRegisterData: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve()),
  checkIfUserAlreadyActive: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve()),
};
