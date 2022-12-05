import { Injectable } from '@nestjs/common';
import {
  InvalidDateFormatException,
  OperationNotFoundException,
} from '@app/common/exceptions';
import { OperationsRepository } from '@app/database';
import { Operation } from '@prisma/client';
import { isValidIsoDate } from '@app/common/utils';

@Injectable()
export class OperationsValidatorService {
  constructor(private readonly operationsRepository: OperationsRepository) {}

  async findAndValidateOperation(
    operationId: number,
    userId: number,
  ): Promise<Operation> {
    const operation = await this.operationsRepository.findById(
      operationId,
      userId,
    );

    if (!operation) {
      throw new OperationNotFoundException(operationId);
    }
    return operation;
  }

  validateDate(date: Date): Date {
    const validDate = isValidIsoDate(date);
    if (!validDate) {
      throw new InvalidDateFormatException();
    }

    return new Date(date);
  }
}
