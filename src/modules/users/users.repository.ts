import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    console.log(this.prisma);
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }
}
