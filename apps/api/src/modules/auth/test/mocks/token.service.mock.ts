import { jwtTokensStub } from '../stubs/jwt-tokens.stub';

export const TokenServiceMock = {
  generateTokens: jest.fn().mockResolvedValue(jwtTokensStub()),
};
