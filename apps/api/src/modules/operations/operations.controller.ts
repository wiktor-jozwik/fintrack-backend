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
import { OperationsService } from './services';
import { OperationInterceptor, OperationsInterceptor } from './interceptors';
import {
  CreateOperationDto,
  SearchOperationDto,
  UpdateOperationDto,
} from './dto';
import { UserId } from '../../common/decorators';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  DefaultCurrencyOperationResponse,
  OperationWithCurrencyCategoryResponse,
} from '../operations/responses';
import { OperationEntity } from '../../common/entities';

@ApiTags('operations')
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @ApiCreatedResponse({ type: OperationEntity })
  @UseInterceptors(OperationInterceptor)
  @Post()
  create(
    @Body() createOperationDto: CreateOperationDto,
    @UserId() userId: number,
  ): Promise<OperationEntity> {
    return this.operationsService.create(createOperationDto, userId);
  }

  @ApiOkResponse({ type: [OperationWithCurrencyCategoryResponse] })
  @UseInterceptors(OperationsInterceptor)
  @Get()
  findAll(
    @UserId() userId: number,
    @Query() query: SearchOperationDto,
  ): Promise<OperationWithCurrencyCategoryResponse[]> {
    return this.operationsService.findAll(userId, query);
  }

  @ApiOkResponse({ type: [DefaultCurrencyOperationResponse] })
  @UseInterceptors(OperationsInterceptor)
  @Get('default_currency')
  findAllInDefaultCurrency(
    @UserId() userId: number,
    @Query() query: SearchOperationDto,
  ): Promise<DefaultCurrencyOperationResponse[]> {
    return this.operationsService.findAllInDefaultCurrency(userId, query);
  }

  @ApiOkResponse({ type: OperationEntity })
  @UseInterceptors(OperationInterceptor)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) operationId: number,
    @Body() updateOperationDto: UpdateOperationDto,
    @UserId() userId: number,
  ): Promise<OperationEntity> {
    return this.operationsService.update(
      updateOperationDto,
      operationId,
      userId,
    );
  }

  @ApiOkResponse({ type: OperationEntity })
  @UseInterceptors(OperationInterceptor)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) operationId: number,
    @UserId() userId: number,
  ): Promise<OperationEntity> {
    return this.operationsService.remove(operationId, userId);
  }
}
