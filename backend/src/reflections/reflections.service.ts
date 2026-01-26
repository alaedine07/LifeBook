import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateReflectionDto } from './dto/create-reflection.dto';

@Injectable()
export class ReflectionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReflectionDto) {
    return this.prisma.reflection.create({
      data: {
        userId,
        question: dto.question,
        type: dto.type,
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.reflection.findMany({ where: { userId } });
  }
}
