import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationsService } from './operations.service';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationsService.create(createOperationDto);
  }

  @Get()
  findAll() {
    return this.operationsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationsService.remove(+id);
  }
}
