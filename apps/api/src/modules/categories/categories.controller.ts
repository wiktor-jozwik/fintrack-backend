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
import { CategoriesService } from './services';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserId } from '../../common/decorators';
import { CategoryEntity } from '../../common/entities';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiCreatedResponse({
    type: CategoryEntity,
  })
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UserId() userId: number,
  ): Promise<CategoryEntity> {
    return this.categoriesService.create(createCategoryDto, userId);
  }

  @ApiOkResponse({
    type: [CategoryEntity],
  })
  @Get()
  findAll(@UserId() userId: number): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll(userId);
  }

  @ApiOkResponse({
    type: CategoryEntity,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UserId() userId: number,
  ): Promise<CategoryEntity> {
    return this.categoriesService.update(updateCategoryDto, categoryId, userId);
  }

  @ApiOkResponse({
    type: CategoryEntity,
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) categoryId: number,
    @UserId() userId: number,
  ): Promise<CategoryEntity> {
    return this.categoriesService.remove(categoryId, userId);
  }
}
