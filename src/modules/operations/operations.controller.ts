import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationsService } from './operations.service';
import { UserId } from '../../common/decorators/user-id';
import { OperationInterceptor } from './interceptors/operation.interceptor';
import { OperationsInterceptor } from './interceptors/operations.interceptor';
import { SearchOperationDto } from './dto/search-operation.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @UseInterceptors(OperationInterceptor)
  @Post()
  create(
    @Body() createOperationDto: CreateOperationDto,
    @UserId() userId: number,
  ) {
    return this.operationsService.create(createOperationDto, userId);
  }

  @UseInterceptors(OperationsInterceptor)
  @Get()
  findAll(@UserId() userId: number, @Query() query: SearchOperationDto) {
    return this.operationsService.findAll(userId, query);
  }

  @UseInterceptors(OperationInterceptor)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) operationId: number,
    @Body() updateOperationDto: UpdateOperationDto,
    @UserId() userId: number,
  ) {
    return this.operationsService.update(
      updateOperationDto,
      operationId,
      userId,
    );
  }

  @UseInterceptors(OperationInterceptor)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) operationId: number,
    @UserId() userId: number,
  ) {
    return this.operationsService.remove(operationId, userId);
  }
}
