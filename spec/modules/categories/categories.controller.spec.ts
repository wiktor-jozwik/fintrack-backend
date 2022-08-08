import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../../src/modules/categories/categories.controller';
import { CategoriesService } from '../../../src/modules/categories/categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
