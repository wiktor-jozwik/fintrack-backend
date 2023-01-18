import { CurrenciesValidatorService } from '../../../currencies/services';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '@app/database';
import { UsersRepositoryMock } from '@app/database/repositories/test/mocks';
import { User } from '@prisma/client';
import { currencyStub, userStub } from '@app/database/repositories/test/stubs';
import {
  MailTokenService,
  UsersMailerService,
  UsersService,
  UsersValidatorService,
} from '../../services';
import {
  UsersCurrenciesService,
  UsersCurrenciesValidatorService,
} from '../../../users-currencies/services';
import { UsersCurrenciesValidatorServiceMock } from '../../../users-currencies/test/mocks/users-currencies-validator.service.mock';
import { CurrenciesValidatorServiceMock } from '../../../currencies/test/mocks/currencies-validator.service.mock';
import { UsersMailerServiceMock } from '../mocks/users-mailer.service.mock';
import { MailTokenServiceMock } from '../mocks/mail-token.service.mock';
import { UsersCurrenciesServiceMock } from '../../../users-currencies/test/mocks/users-currencies.service.mock';
import { UserRegisterDto } from '../../dto';
import { UsersValidatorServiceMock } from '../mocks/users-validator.service.mock';
import { stringStub } from '../stubs/string.stub';
import { UserProfileResponse } from '../../responses';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersValidatorService: UsersValidatorService;
  let usersCurrenciesValidatorService: UsersCurrenciesValidatorService;
  let currenciesValidatorService: CurrenciesValidatorService;
  let usersMailerService: UsersMailerService;
  let mailTokenService: MailTokenService;
  let usersCurrenciesService: UsersCurrenciesService;
  let usersRepository: UsersRepository;

  const usersValidatorServiceMock = UsersValidatorServiceMock;
  const usersCurrenciesValidatorServiceMock =
    UsersCurrenciesValidatorServiceMock;
  const currenciesValidatorServiceMock = CurrenciesValidatorServiceMock;
  const usersMailerServiceMock = UsersMailerServiceMock;
  const mailTokenServiceMock = MailTokenServiceMock;
  const usersCurrenciesServiceMock = UsersCurrenciesServiceMock;
  const usersRepositoryMock = UsersRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersValidatorService,
        UsersCurrenciesValidatorService,
        CurrenciesValidatorService,
        UsersMailerService,
        MailTokenService,
        UsersCurrenciesService,
        UsersRepository,
      ],
    })
      .overrideProvider(UsersValidatorService)
      .useValue(usersValidatorServiceMock)
      .overrideProvider(UsersCurrenciesValidatorService)
      .useValue(usersCurrenciesValidatorServiceMock)
      .overrideProvider(CurrenciesValidatorService)
      .useValue(currenciesValidatorServiceMock)
      .overrideProvider(UsersMailerService)
      .useValue(usersMailerServiceMock)
      .overrideProvider(MailTokenService)
      .useValue(mailTokenServiceMock)
      .overrideProvider(UsersCurrenciesService)
      .useValue(usersCurrenciesServiceMock)
      .overrideProvider(UsersRepository)
      .useValue(usersRepositoryMock)
      .compile();

    usersService = module.get<UsersService>(UsersService);
    usersValidatorService = module.get<UsersValidatorService>(
      UsersValidatorService,
    );
    usersCurrenciesValidatorService =
      module.get<UsersCurrenciesValidatorService>(
        UsersCurrenciesValidatorService,
      );
    currenciesValidatorService = module.get<CurrenciesValidatorService>(
      CurrenciesValidatorService,
    );
    usersMailerService = module.get<UsersMailerService>(UsersMailerService);
    mailTokenService = module.get<MailTokenService>(MailTokenService);
    usersCurrenciesService = module.get<UsersCurrenciesService>(
      UsersCurrenciesService,
    );
    usersRepository = module.get<UsersRepository>(UsersRepository);

    jest.clearAllMocks();
  });

  describe('register', () => {
    describe('when register is called', () => {
      let user: User;

      const userRegisterDto: UserRegisterDto = {
        email: userStub().email,
        defaultCurrencyName: currencyStub().name,
        password: 'password',
        passwordConfirmation: 'password',
        firstName: userStub().firstName ?? undefined,
        lastName: userStub().lastName ?? undefined,
        phoneNumber: userStub().phoneNumber ?? undefined,
      };

      beforeEach(async () => {
        user = await usersService.register(userRegisterDto);
      });

      it('should call usersValidatorService', () => {
        expect(usersValidatorService.validateRegisterData).toBeCalledWith(
          userRegisterDto,
        );
      });

      it('should call currenciesValidatorService', () => {
        expect(
          currenciesValidatorService.findAndValidateCurrency,
        ).toBeCalledWith(userRegisterDto.defaultCurrencyName);
      });

      it('should call usersRepository', () => {
        expect(usersRepository.create).toBeCalled();
      });

      it('should call usersCurrenciesService', () => {
        expect(usersCurrenciesService.createUsersCurrency).toBeCalledWith(
          currencyStub(),
          userStub().id,
        );
      });

      it('should call mailTokenService', () => {
        expect(mailTokenService.generateEmailConfirmationToken).toBeCalledWith(
          userStub().email,
        );
      });

      it('should call usersMailerService', () => {
        expect(usersMailerService.sendActivationMail).toBeCalledWith(
          userStub().email,
          stringStub(),
        );
      });

      it('should return user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('getProfileData', () => {
    describe('when getProfileData is called', () => {
      let userProfileResponse: UserProfileResponse;

      const userId: number = userStub().id;

      beforeEach(async () => {
        userProfileResponse = await usersService.getProfileData(userId);
      });

      it('should call usersValidatorService', () => {
        expect(usersValidatorService.findAndValidateUser).toBeCalledWith(
          userId,
        );
      });

      it('should call usersCurrenciesValidatorService', () => {
        expect(
          usersCurrenciesValidatorService.findAndValidateUsersDefaultCurrency,
        ).toBeCalledWith(userId);
      });

      it('should return user and default currency', () => {
        expect(userProfileResponse).toEqual({
          user: userStub(),
          defaultCurrency: currencyStub(),
        });
      });
    });
  });

  describe('confirmEmail', () => {
    describe('when confirmEmail is called', () => {
      const token = stringStub();
      const email = stringStub();

      beforeEach(async () => {
        await usersService.confirmEmail(token);
      });

      it('should call mailTokenService', () => {
        expect(mailTokenService.decodeConfirmationToken).toBeCalledWith(token);
      });

      it('should call usersValidatorService', () => {
        expect(usersValidatorService.checkIfUserAlreadyActive).toBeCalledWith(
          email,
        );
      });

      it('should call usersRepository', () => {
        expect(usersRepository.updateByEmail).toBeCalledWith(stringStub(), {
          isActive: true,
        });
      });
    });
  });

  describe('resendActivationEmail', () => {
    describe('when resendActivationEmail is called', () => {
      let email = stringStub();

      beforeEach(async () => {
        email = await usersService.resendActivationEmail(email);
      });

      it('should call usersValidatorService', () => {
        expect(usersValidatorService.checkIfUserAlreadyActive).toBeCalledWith(
          email,
        );
      });

      it('should call mailTokenService', () => {
        expect(mailTokenService.generateEmailConfirmationToken).toBeCalledWith(
          email,
        );
      });

      it('should call usersMailerService', () => {
        expect(usersMailerService.sendActivationMail).toBeCalledWith(
          email,
          stringStub(),
        );
      });
    });
  });
});
