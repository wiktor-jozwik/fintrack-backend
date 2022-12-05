import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  firstName: string | null;

  @ApiProperty()
  lastName: string | null;

  @ApiProperty()
  phoneNumber: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  passwordHash: string;

  @ApiProperty()
  refreshTokenHash: string | null;
}
