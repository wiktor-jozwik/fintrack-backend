import { ConflictException } from '@nestjs/common';

export class OperationAlreadyImportedException extends ConflictException {
  constructor(referentialNumber: string, origin: string) {
    super(
      `Operation with referential number: '${referentialNumber}' using '${origin}' is already imported`,
    );
  }
}
