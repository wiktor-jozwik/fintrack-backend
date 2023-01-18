import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesRepository } from '@app/database';
import { Category } from '@prisma/client';
import { CategoriesService, CategoriesValidatorService } from '../../services';
import { CategoriesValidatorServiceMock } from '../mocks/categories-validator.service.mock';
import { CategoriesRepositoryMock } from '@app/database/repositories/test/mocks/categories.repository.mock';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto';
import { categoryStub } from '@app/database/repositories/test/stubs/category.stub';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoriesValidatorService: CategoriesValidatorService;
  let categoriesRepository: CategoriesRepository;

  const categoriesValidatorServiceMock = CategoriesValidatorServiceMock;
  const categoriesRepositoryMock = CategoriesRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        CategoriesValidatorService,
        CategoriesRepository,
      ],
    })
      .overrideProvider(CategoriesValidatorService)
      .useValue(categoriesValidatorServiceMock)
      .overrideProvider(CategoriesRepository)
      .useValue(categoriesRepositoryMock)
      .compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesValidatorService = module.get<CategoriesValidatorService>(
      CategoriesValidatorService,
    );
    categoriesRepository =
      module.get<CategoriesRepository>(CategoriesRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let category: Category;
      const createCategoryDto: CreateCategoryDto = {
        name: categoryStub().name,
        type: categoryStub().type,
        isInternal: categoryStub().isInternal,
      };
      const userId = categoryStub().userId;

      beforeEach(async () => {
        category = await categoriesService.create(createCategoryDto, userId);
      });

      it('should call categoriesValidatorService', () => {
        expect(
          categoriesValidatorService.validateNameUniqueness,
        ).toBeCalledWith(
          createCategoryDto.name,
          createCategoryDto.type,
          userId,
        );
      });

      it('should call categoriesRepository', () => {
        expect(categoriesRepository.create).toBeCalledWith({
          ...createCategoryDto,
          user: { connect: { id: userId } },
        });
      });

      it('should return created category', () => {
        expect(category).toEqual(categoryStub());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let categories: Category[];
      const userId = categoryStub().userId;

      beforeEach(async () => {
        categories = await categoriesService.findAll(userId);
      });

      it('should call categoriesRepository', () => {
        expect(categoriesRepository.findAll).toBeCalledWith(userId);
      });

      it('should return an array', () => {
        expect(categories).toBeInstanceOf(Array);
      });

      it('should return categories', () => {
        expect(categories).toEqual([categoryStub()]);
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let category: Category;
      const newName = 'new name test';
      const updateCategoryDto: UpdateCategoryDto = {
        name: newName,
      };
      const categoryId = categoryStub().id;
      const userId = categoryStub().userId;

      beforeEach(async () => {
        category = await categoriesService.update(
          updateCategoryDto,
          categoryId,
          userId,
        );
      });

      it('should call categoriesValidatorService', () => {
        expect(
          categoriesValidatorService.findAndValidateCategory,
        ).toBeCalledWith(categoryId, userId);
      });

      it('should call categoriesValidatorService', () => {
        expect(
          categoriesValidatorService.validateIfFieldsChanged,
        ).toBeCalledWith(
          categoryStub(),
          updateCategoryDto.name,
          undefined,
          userId,
        );
      });

      it('should call categoriesRepository', () => {
        expect(categoriesRepository.update).toBeCalledWith(
          categoryId,
          updateCategoryDto,
        );
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      let category: Category;
      const categoryId = categoryStub().id;
      const userId = categoryStub().userId;

      beforeEach(async () => {
        category = await categoriesService.remove(categoryId, userId);
      });

      it('should call categoriesValidatorService', () => {
        expect(
          categoriesValidatorService.findAndValidateCategory,
        ).toBeCalledWith(categoryId, userId);
      });

      it('should call categoriesValidatorService', () => {
        expect(
          categoriesValidatorService.validateZeroOperations,
        ).toBeCalledWith(categoryId);
      });

      it('should call categoriesRepository', () => {
        expect(categoriesRepository.delete).toBeCalledWith(categoryId);
      });

      it('should return deleted category', () => {
        expect(category).toEqual(categoryStub());
      });
    });
  });
});
