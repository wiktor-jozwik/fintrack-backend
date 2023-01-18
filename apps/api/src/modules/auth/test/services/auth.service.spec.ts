import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '@app/database';
import { UsersRepositoryMock } from '@app/database/repositories/test/mocks';
import { User } from '@prisma/client';
import { userStub } from '@app/database/repositories/test/stubs';
import {
  AuthService,
  AuthValidatorService,
  TokenService,
} from '../../services';
import { UsersValidatorService } from '../../../users/services';
import { UsersValidatorServiceMock } from '../../../users/test/mocks/users-validator.service.mock';
import { AuthValidatorServiceMock } from '../mocks/auth-validator.service.mock';
import { TokenServiceMock } from '../mocks/token.service.mock';
import { JwtTokens } from '../../interfaces';
import { UserEmailPayload } from '@app/common/interfaces';
import { jwtTokensStub } from '../stubs/jwt-tokens.stub';

describe('AuthService', () => {
  let authService: AuthService;
  let authValidatorService: AuthValidatorService;
  let usersValidatorService: UsersValidatorService;
  let tokenService: TokenService;
  let usersRepository: UsersRepository;

  const authValidatorServiceMock = AuthValidatorServiceMock;
  const usersValidatorServiceMock = UsersValidatorServiceMock;
  const tokenServiceMock = TokenServiceMock;
  const usersRepositoryMock = UsersRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AuthValidatorService,
        UsersValidatorService,
        TokenService,
        UsersRepository,
      ],
    })
      .overrideProvider(AuthValidatorService)
      .useValue(authValidatorServiceMock)
      .overrideProvider(UsersValidatorService)
      .useValue(usersValidatorServiceMock)
      .overrideProvider(TokenService)
      .useValue(tokenServiceMock)
      .overrideProvider(UsersRepository)
      .useValue(usersRepositoryMock)
      .compile();

    authService = module.get<AuthService>(AuthService);
    authValidatorService =
      module.get<AuthValidatorService>(AuthValidatorService);
    usersValidatorService = module.get<UsersValidatorService>(
      UsersValidatorService,
    );
    tokenService = module.get<TokenService>(TokenService);
    usersRepository = module.get<UsersRepository>(UsersRepository);

    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    describe('when validateUser is called', () => {
      let user: User;

      const email = userStub().email;
      const plainTextPassword = 'plain text password';

      beforeEach(async () => {
        user = await authService.validateUser(email, plainTextPassword);
      });

      it('should call authValidatorService', () => {
        expect(authValidatorService.validateUserCredentials).toBeCalledWith(
          email,
          plainTextPassword,
        );
      });

      it('should return user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('login', () => {
    describe('when login is called', () => {
      let jwtTokens: JwtTokens;

      const userEmailPayload: UserEmailPayload = {
        email: userStub().email,
        id: userStub().id,
      };

      beforeEach(async () => {
        jwtTokens = await authService.login(userEmailPayload);
      });

      it('should call usersValidatorService', () => {
        expect(usersValidatorService.findAndValidateUser).toBeCalledWith(
          userEmailPayload.email,
        );
      });

      it('should call tokenService', () => {
        expect(tokenService.generateTokens).toBeCalledWith({
          id: userEmailPayload.id,
          email: userEmailPayload.email,
          isActive: userStub().isActive,
        });
      });

      it('should call usersRepository', () => {
        expect(usersRepository.updateById).toBeCalled();
      });

      it('should return jwt tokens', () => {
        expect(jwtTokens).toEqual(jwtTokensStub());
      });
    });
  });

  describe('logout', () => {
    describe('when logout is called', () => {
      let logout: boolean;
      const userId = userStub().id;

      beforeEach(async () => {
        logout = await authService.logout(userId);
      });

      it('should call usersRepository', () => {
        expect(usersRepository.updateById).toBeCalledWith(userId, {
          refreshTokenHash: null,
        });
      });

      it('should return true', () => {
        expect(logout).toEqual(true);
      });
    });
  });

  describe('refreshTokens', () => {
    describe('when refreshTokens is called', () => {
      let jwtTokens: JwtTokens;

      const userId = userStub().id;
      const refreshToken = 'refresh token';

      beforeEach(async () => {
        jwtTokens = await authService.refreshTokens(userId, refreshToken);
      });

      it('should call authValidatorService', () => {
        expect(authValidatorService.validateUserRefreshToken).toBeCalledWith(
          userId,
          refreshToken,
        );
      });

      it('should call usersRepository', () => {
        expect(usersRepository.updateById).toBeCalled();
      });

      it('should return jwt tokens', () => {
        expect(jwtTokens).toEqual(jwtTokensStub());
      });
    });
  });
});
