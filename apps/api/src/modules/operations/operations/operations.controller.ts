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
import { OperationsService } from './domain';
import { OperationInterceptor, OperationsInterceptor } from './interceptors';
import {
  CreateOperationDto,
  SearchOperationDto,
  UpdateOperationDto,
} from './dto';
import { UserId } from '@api/common/decorators';

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

  @UseInterceptors(OperationsInterceptor)
  @Get('default_currency')
  findAllInDefaultCurrency(
    @UserId() userId: number,
    @Query() query: SearchOperationDto,
  ) {
    return this.operationsService.findAllInDefaultCurrency(userId, query);
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
