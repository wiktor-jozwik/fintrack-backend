import { CreateOperationDto } from './create-operation.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateOperationDto extends PartialType(CreateOperationDto) {}
