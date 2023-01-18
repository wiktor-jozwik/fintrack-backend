import { operationStub } from '@app/database/repositories/test/stubs';

export const OperationsValidatorServiceMock = {
  findAndValidateOperation: jest.fn().mockResolvedValue(operationStub()),
  validateDate: jest.fn().mockResolvedValue(new Date('2022-01-01')),
};
