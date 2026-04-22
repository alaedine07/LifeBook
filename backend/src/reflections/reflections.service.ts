import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReflectionDto } from './dto/create-reflection.dto';
import { UpdateReflectionDto } from './dto/update-reflection.dto';

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
    const reflections = this.prisma.reflection.findMany({ where: { userId } });
    return reflections;
  }

  async update(userId: number, reflectionId: number, dto: UpdateReflectionDto) {
    const reflection = await this.prisma.reflection.findUnique({
      where: { id: reflectionId },
    });

    if (!reflection || reflection.userId !== userId) {
      throw new BadRequestException('Invalid reflection');
    }

    return this.prisma.reflection.update({
      where: { id: reflectionId },
      data: {
        question: dto.question,
      },
    });
  }

  async delete(userId: number, reflectionId: number) {
    const reflection = await this.prisma.reflection.findUnique({
      where: { id: reflectionId },
    });

    if (!reflection || reflection.userId !== userId) {
      throw new BadRequestException('Invalid reflection');
    }

    return this.prisma.reflection.delete({
      where: { id: reflectionId },
    });
  }
}
