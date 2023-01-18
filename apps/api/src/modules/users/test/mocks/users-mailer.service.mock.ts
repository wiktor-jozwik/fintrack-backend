export const UsersMailerServiceMock = {
  sendActivationMail: jest.fn().mockImplementationOnce(() => Promise.resolve()),
};
