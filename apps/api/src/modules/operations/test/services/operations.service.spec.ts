import { Test, TestingModule } from '@nestjs/testing';
import {
  DefaultCurrencyOperationCalculatorService,
  OperationsService,
  OperationsValidatorService,
} from '../../services';
import { CategoriesValidatorService } from '../../../categories/services';
import { UsersCurrenciesValidatorService } from '../../../users-currencies/services';
import { OperationsRepository } from '@app/database';
import { CategoriesValidatorServiceMock } from '../../../categories/test/mocks/categories-validator.service.mock';
import { UsersCurrenciesValidatorServiceMock } from '../../../users-currencies/test/mocks/users-currencies-validator.service.mock';
import { OperationsValidatorServiceMock } from '../mocks/operations-validator.service.mock';
import { DefaultCurrencyOperationCalculatorServiceMock } from '../mocks/default-currency-operation-calculator.service.mock';
import { OperationsRepositoryMock } from '@app/database/repositories/test/mocks';
import {
  categoryStub,
  currencyStub,
  operationStub,
  userStub,
} from '@app/database/repositories/test/stubs';
import { CreateOperationDto, SearchOperationDto } from '../../dto';
import { Operation } from '@prisma/client';

describe('OperationsService', () => {
  let operationsService: OperationsService;
  let categoriesValidatorService: CategoriesValidatorService;
  let usersCurrenciesValidatorService: UsersCurrenciesValidatorService;
  let operationsValidatorService: OperationsValidatorService;
  let defaultCurrencyOperationCalculatorService: DefaultCurrencyOperationCalculatorService;
  let operationsRepository: OperationsRepository;

  const categoriesValidatorServiceMock = CategoriesValidatorServiceMock;
  const usersCurrenciesValidatorServiceMock =
    UsersCurrenciesValidatorServiceMock;
  const operationsValidatorServiceMock = OperationsValidatorServiceMock;
  const defaultCurrencyOperationCalculatorServiceMock =
    DefaultCurrencyOperationCalculatorServiceMock;
  const operationsRepositoryMock = OperationsRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationsService,
        CategoriesValidatorService,
        UsersCurrenciesValidatorService,
        OperationsValidatorService,
        DefaultCurrencyOperationCalculatorService,
        OperationsRepository,
      ],
    })
      .overrideProvider(CategoriesValidatorService)
      .useValue(categoriesValidatorServiceMock)
      .overrideProvider(UsersCurrenciesValidatorService)
      .useValue(usersCurrenciesValidatorServiceMock)
      .overrideProvider(OperationsValidatorService)
      .useValue(operationsValidatorServiceMock)
      .overrideProvider(DefaultCurrencyOperationCalculatorService)
      .useValue(defaultCurrencyOperationCalculatorServiceMock)
      .overrideProvider(OperationsRepository)
      .useValue(operationsRepositoryMock)
      .compile();

    operationsService = module.get<OperationsService>(OperationsService);
    categoriesValidatorService = module.get<CategoriesValidatorService>(
      CategoriesValidatorService,
    );
    usersCurrenciesValidatorService =
      module.get<UsersCurrenciesValidatorService>(
        UsersCurrenciesValidatorService,
      );
    operationsValidatorService = module.get<OperationsValidatorService>(
      OperationsValidatorService,
    );
    defaultCurrencyOperationCalculatorService =
      module.get<DefaultCurrencyOperationCalculatorService>(
        DefaultCurrencyOperationCalculatorService,
      );
    operationsRepository =
      module.get<OperationsRepository>(OperationsRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let operation: Operation;
      const createOperationDto: CreateOperationDto = {
        name: operationStub().name,
        categoryName: 'category name',
        moneyAmount: Number(operationStub().moneyAmount),
        currencyName: 'PLN',
        date: operationStub().date,
      };
      const userId = userStub().id;

      beforeEach(async () => {
        operation = await operationsService.create(createOperationDto, userId);
      });

      it('should call categoriesValidatorService', () => {
        expect(
          categoriesValidatorService.findAndValidateCategory,
        ).toBeCalledWith(createOperationDto.categoryName, userId);
      });

      it('should call usersCurrenciesValidatorService', () => {
        expect(
          usersCurrenciesValidatorService.findAndValidateUsersCurrency,
        ).toBeCalledWith(createOperationDto.currencyName, userId);
      });

      it('should call operationsValidatorService', () => {
        expect(operationsValidatorService.validateDate).toBeCalledWith(
          createOperationDto.date,
        );
      });

      it('should call operationsRepository', () => {
        expect(operationsRepository.create).toBeCalled();
      });

      it('should call operationsRepository', () => {
        expect(operation).toEqual(operationStub());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let operations: Operation[];
      const searchOperationDto: SearchOperationDto = {
        searchName: 'test',
      };
      const userId = userStub().id;

      beforeEach(async () => {
        operations = await operationsService.findAll(
          userId,
          searchOperationDto,
        );
      });

      it('should call operationsRepository', () => {
        expect(operationsRepository.findAll).toBeCalledWith(
          userId,
          searchOperationDto,
        );
      });

      it('should return array', () => {
        expect(operations).toBeInstanceOf(Array);
      });

      it('should return operations with currency and category', () => {
        expect(operations[0]).toEqual({
          ...operationStub(),
          category: categoryStub(),
          currency: currencyStub(),
        });
      });
    });
  });
});
