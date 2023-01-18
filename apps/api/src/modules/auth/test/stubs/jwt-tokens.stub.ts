import { JwtTokens } from '../../interfaces';

export const jwtTokensStub = (): JwtTokens => {
  return {
    jwtAccessToken: 'JWT AT TOKEN',
    jwtRefreshToken: 'JWT RT TOKEN',
  };
};
