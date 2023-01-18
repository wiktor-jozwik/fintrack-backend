import { CurrenciesValidatorService } from '../../../currencies/services';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesRepository, UsersCurrenciesRepository } from '@app/database';
import {
  CurrenciesRepositoryMock,
  UsersCurrenciesRepositoryMock,
} from '@app/database/repositories/test/mocks';
import { Currency } from '@prisma/client';
import { currencyStub } from '@app/database/repositories/test/stubs';
import {
  UsersCurrenciesService,
  UsersCurrenciesValidatorService,
} from '../../services';
import { UsersCurrenciesValidatorServiceMock } from '../mocks/users-currencies-validator.service.mock';
import { CreateCurrencyDto } from '../../dto';
import { CurrenciesValidatorServiceMock } from '../../../currencies/test/mocks/currencies-validator.service.mock';

describe('UsersCurrenciesService', () => {
  let usersCurrenciesService: UsersCurrenciesService;
  let currenciesValidatorService: CurrenciesValidatorService;
  let usersCurrenciesValidatorService: UsersCurrenciesValidatorService;
  let usersCurrenciesRepository: UsersCurrenciesRepository;
  let currenciesRepository: CurrenciesRepository;

  const currenciesValidatorServiceMock = CurrenciesValidatorServiceMock;
  const usersCurrenciesValidatorServiceMock =
    UsersCurrenciesValidatorServiceMock;
  const usersCurrenciesRepositoryMock = UsersCurrenciesRepositoryMock;
  const currenciesRepositoryMock = CurrenciesRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersCurrenciesService,
        CurrenciesValidatorService,
        UsersCurrenciesValidatorService,
        UsersCurrenciesRepository,
        CurrenciesRepository,
      ],
    })
      .overrideProvider(CurrenciesValidatorService)
      .useValue(currenciesValidatorServiceMock)
      .overrideProvider(UsersCurrenciesValidatorService)
      .useValue(usersCurrenciesValidatorServiceMock)
      .overrideProvider(UsersCurrenciesRepository)
      .useValue(usersCurrenciesRepositoryMock)
      .overrideProvider(CurrenciesRepository)
      .useValue(currenciesRepositoryMock)
      .compile();

    usersCurrenciesService = module.get<UsersCurrenciesService>(
      UsersCurrenciesService,
    );
    currenciesValidatorService = module.get<CurrenciesValidatorService>(
      CurrenciesValidatorService,
    );
    usersCurrenciesValidatorService =
      module.get<UsersCurrenciesValidatorService>(
        UsersCurrenciesValidatorService,
      );
    usersCurrenciesRepository = module.get<UsersCurrenciesRepository>(
      UsersCurrenciesRepository,
    );
    currenciesRepository =
      module.get<CurrenciesRepository>(CurrenciesRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      const createCurrencyDto: CreateCurrencyDto = {
        name: 'USD',
      };
      const userId = 10;

      it('should throw an error', () => {
        expect(async () => {
          try {
            await usersCurrenciesService.create(createCurrencyDto, userId);
          } catch (e) {
            expect(e.message).toBe(
              `Currency '${createCurrencyDto.name}' already added`,
            );
          }
        });
      });
    });

    describe('when create is called if currency not added', () => {
      const defaultFindById = usersCurrenciesRepositoryMock.findById;

      beforeAll(() => {
        usersCurrenciesRepositoryMock.findById = jest
          .fn()
          .mockResolvedValue(null);
      });
      afterAll(() => {
        usersCurrenciesRepositoryMock.findById = defaultFindById;
      });

      let currency: Currency;

      const createCurrencyDto: CreateCurrencyDto = {
        name: 'USD',
      };
      const userId = 10;

      beforeEach(async () => {
        currency = await usersCurrenciesService.create(
          createCurrencyDto,
          userId,
        );
      });

      it('should call currenciesValidatorService', () => {
        expect(
          currenciesValidatorService.findAndValidateCurrency,
        ).toBeCalledWith(createCurrencyDto.name);
      });

      it('should call usersCurrenciesRepository', () => {
        expect(usersCurrenciesRepository.findById).toBeCalledWith(
          currencyStub().id,
          userId,
        );
      });

      it('should call usersCurrenciesRepository', () => {
        expect(usersCurrenciesRepository.create).toBeCalled();
      });

      it('should return currency', () => {
        expect(currency).toEqual(currencyStub());
      });
    });
  });
});
