import { stringStub } from '../stubs/string.stub';

export const MailTokenServiceMock = {
  generateEmailConfirmationToken: jest
    .fn()
    .mockImplementation(() => stringStub()),
  decodeConfirmationToken: jest.fn().mockResolvedValue(stringStub()),
};
