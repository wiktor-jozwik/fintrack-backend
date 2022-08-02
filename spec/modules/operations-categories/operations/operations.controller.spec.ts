import { Test, TestingModule } from '@nestjs/testing';
import { OperationsController } from '../../../../src/modules/operations-categories/operations/operations.controller';
import { OperationsService } from '../../../../src/modules/operations-categories/operations/operations.service';

describe('OperationsController', () => {
  let controller: OperationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationsController],
      providers: [OperationsService],
    }).compile();

    controller = module.get<OperationsController>(OperationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
