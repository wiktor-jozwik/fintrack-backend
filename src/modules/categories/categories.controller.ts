import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { UserId } from '../../decorators/user-id';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @UserId() userId: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.categoriesService.findAll(userId);
  }

  @Delete(':id')
  remove(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.categoriesService.remove(userId, categoryId);
  }
}
