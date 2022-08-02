import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OperationsCategoriesService } from '../operations-categories.service';

@Controller('operations')
export class OperationsController {
  constructor(
    private readonly operationsCategoriesService: OperationsCategoriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationsCategoriesService.createOperation(createOperationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.operationsCategoriesService.findAllOperations();
  }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.operationsService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateOperationDto: UpdateOperationDto,
  // ) {
  //   return this.operationsService.update(+id, updateOperationDto);
  // }
  //
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationsCategoriesService.removeOperation(+id);
  }
}
