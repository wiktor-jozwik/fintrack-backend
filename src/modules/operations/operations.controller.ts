import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationsService } from './operations.service';
import { UserId } from '../../decorators/user-id';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  create(
    @UserId() userId: number,
    @Body() createOperationDto: CreateOperationDto,
  ) {
    return this.operationsService.create(userId, createOperationDto);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.operationsService.findAll(userId);
  }

  @Delete(':id')
  remove(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) operationId: number,
  ) {
    return this.operationsService.remove(userId, operationId);
  }
}
