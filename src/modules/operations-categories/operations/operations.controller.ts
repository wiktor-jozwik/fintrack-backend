import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationsCategoriesService } from '../operations-categories.service';

@Controller('operations')
export class OperationsController {
  constructor(
    private readonly operationsCategoriesService: OperationsCategoriesService,
  ) {}

  @Post()
  create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationsCategoriesService.createOperation(createOperationDto);
  }

  @Get()
  findAll() {
    return this.operationsCategoriesService.findAllOperations();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationsCategoriesService.removeOperation(+id);
  }
}
