import { Category, CategoryType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity implements Category {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: CategoryType;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  isInternal: boolean;
}
