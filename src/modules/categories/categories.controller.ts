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
    @Body() createCategoryDto: CreateCategoryDto,
    @UserId() userId: number,
  ) {
    return this.categoriesService.create(createCategoryDto, userId);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.categoriesService.findAll(userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) categoryId: number,
    @UserId() userId: number,
  ) {
    return this.categoriesService.remove(categoryId, userId);
  }
}
