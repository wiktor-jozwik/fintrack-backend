import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { OperationsCategoriesService } from '../operations-categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly operationsCategoriesService: OperationsCategoriesService,
  ) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.operationsCategoriesService.createCategory(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.operationsCategoriesService.findAllCategories();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationsCategoriesService.removeCategory(+id);
  }
}
