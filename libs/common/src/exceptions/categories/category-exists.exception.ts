import { ConflictException } from '@nestjs/common';

export class CategoryExistsException extends ConflictException {
  constructor(name: string) {
    super(`Category '${name}' already exists`);
  }
}
