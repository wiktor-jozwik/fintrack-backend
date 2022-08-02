import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OperationsCategoriesService } from '../operations-categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly operationsCategoriesService: OperationsCategoriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.operationsCategoriesService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.operationsCategoriesService.findAllCategories();
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoriesService.findOne(+id);
  // }
  //
  // @UseGuards(JwtAuthGuard)
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoriesService.update(+id, updateCategoryDto);
  // }
  //
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationsCategoriesService.removeCategory(+id);
  }
}
