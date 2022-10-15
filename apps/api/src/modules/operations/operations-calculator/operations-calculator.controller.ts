import { Controller, Get, Query } from '@nestjs/common';
import { UserId } from '../../../common/decorators/user-id';
import { CalculateOperationsDto } from './dto/calculate-operations.dto';
import { OperationsCalculatorService } from './operations-calculator.service';

@Controller('operations_calculator')
export class OperationsCalculatorController {
  constructor(
    private readonly operationsCalculatorService: OperationsCalculatorService,
  ) {}
  @Get()
  calculate(@UserId() userId: number, @Query() query: CalculateOperationsDto) {
    return this.operationsCalculatorService.calculate(userId, query);
  }
}
