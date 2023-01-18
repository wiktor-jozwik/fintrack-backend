import { Test, TestingModule } from '@nestjs/testing';
import { OperationsImportSaveService } from '../../services/csv-import';
import {
  CategoriesRepository,
  OperationsRepository,
  UsersCurrenciesRepository,
  UsersRepository,
} from '@app/database';
import {
  CategoriesRepositoryMock,
  OperationsRepositoryMock,
  UsersCurrenciesRepositoryMock,
  UsersRepositoryMock,
} from '@app/database/repositories/test/mocks';
import {
  categoryStub,
  currencyStub,
  operationStub,
  usersCurrenciesStub,
  userStub,
} from '@app/database/repositories/test/stubs';
import { SaveOperationItem } from '../../services/csv-import/interfaces';
import { Operation } from '@prisma/client';

describe('OperationsImportSaveService', () => {
  let operationsImportSaveService: OperationsImportSaveService;
  let usersRepository: UsersRepository;
  let operationsRepository: OperationsRepository;
  let categoriesRepository: CategoriesRepository;
  let usersCurrenciesRepository: UsersCurrenciesRepository;

  const usersRepositoryMock = UsersRepositoryMock;
  const operationsRepositoryMock = OperationsRepositoryMock;
  const categoriesRepositoryMock = CategoriesRepositoryMock;
  const usersCurrenciesRepositoryMock = UsersCurrenciesRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationsImportSaveService,
        UsersRepository,
        OperationsRepository,
        CategoriesRepository,
        UsersCurrenciesRepository,
      ],
    })
      .overrideProvider(UsersRepository)
      .useValue(usersRepositoryMock)
      .overrideProvider(OperationsRepository)
      .useValue(operationsRepositoryMock)
      .overrideProvider(CategoriesRepository)
      .useValue(categoriesRepositoryMock)
      .overrideProvider(UsersCurrenciesRepository)
      .useValue(usersCurrenciesRepositoryMock)
      .compile();

    operationsImportSaveService = module.get<OperationsImportSaveService>(
      OperationsImportSaveService,
    );
    usersRepository = module.get<UsersRepository>(UsersRepository);
    operationsRepository =
      module.get<OperationsRepository>(OperationsRepository);
    categoriesRepository =
      module.get<CategoriesRepository>(CategoriesRepository);
    usersCurrenciesRepository = module.get<UsersCurrenciesRepository>(
      UsersCurrenciesRepository,
    );

    jest.clearAllMocks();
  });

  describe('validateUserExistence', () => {
    describe('when validateUserExistence is called', () => {
      const userId = userStub().id;
      beforeEach(async () => {
        await operationsImportSaveService.validateUserExistence(userId);
      });

      it('should call usersRepository', () => {
        expect(usersRepository.findById).toBeCalledWith(userId);
      });
    });
  });

  describe('findCurrency', () => {
    describe('when findCurrency is called', () => {
      const currencyName = currencyStub().name;
      const userId = userStub().id;

      let currencyId: number;

      beforeEach(async () => {
        currencyId = await operationsImportSaveService.findCurrency(
          currencyName,
          userId,
        );
      });

      it('should call usersCurrenciesRepository', () => {
        expect(usersCurrenciesRepository.findByName).toBeCalledWith(
          currencyName,
          userId,
        );
      });

      it('should return currency id', () => {
        expect(currencyId).toEqual(usersCurrenciesStub().currencyId);
      });
    });
  });

  describe('saveOrFindCategory', () => {
    describe('when saveOrFindCategory is called and category is found', () => {
      const categoryType = categoryStub().type;
      const categoryName = categoryStub().name;
      const userId = userStub().id;

      let categoryId: number;

      beforeEach(async () => {
        categoryId = await operationsImportSaveService.saveOrFindCategory(
          categoryType,
          categoryName,
          userId,
        );
      });

      it('should call categoriesRepository', () => {
        expect(categoriesRepository.findByNameAndType).toBeCalledWith(
          categoryName,
          categoryType,

          userId,
        );
      });
    });
  });

  describe('saveOperation', () => {
    describe('when saveOperation is called', () => {
      let operation: Operation;

      const saveOperationItem: SaveOperationItem = {
        userId: userStub().id,
        operationName: operationStub().name,
        categoryId: categoryStub().id,
        currencyId: currencyStub().id,
        absMoneyAmount: Number(operationStub().moneyAmount),
        isoDateString: '2022-05-05',
        originName: 'origin',
        referentialNumber: 'ref number',
      };

      beforeEach(async () => {
        operation = await operationsImportSaveService.saveOperation(
          saveOperationItem,
        );
      });

      it('should call operationsRepository', () => {
        expect(
          operationsRepository.findByReferentialNumberAndOrigin,
        ).toBeCalledWith(
          saveOperationItem.referentialNumber,
          saveOperationItem.originName,
          saveOperationItem.userId,
        );
      });

      it('should call operationsRepository', () => {
        expect(operationsRepository.create).toBeCalled();
      });
    });
  });
});
