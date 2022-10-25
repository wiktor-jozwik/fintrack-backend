import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { UserId } from '@api/common/decorators';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UserId() userId: number,
  ) {
    return this.categoriesService.create(createCategoryDto, userId);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.categoriesService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UserId() userId: number,
  ) {
    return this.categoriesService.update(updateCategoryDto, categoryId, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) categoryId: number,
    @UserId() userId: number,
  ) {
    return this.categoriesService.remove(categoryId, userId);
  }
}
