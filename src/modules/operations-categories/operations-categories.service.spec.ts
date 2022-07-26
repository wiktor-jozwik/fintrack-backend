import { Test, TestingModule } from '@nestjs/testing';
import { OperationsCategoriesService } from './operations-categories.service';

describe('OperationsCategoriesService', () => {
  let service: OperationsCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationsCategoriesService],
    }).compile();

    service = module.get<OperationsCategoriesService>(OperationsCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
