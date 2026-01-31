import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';

@Injectable()
export class MoodsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateMoodDto) {
    return this.prisma.mood.create({
      data: {
        userId,
        moodType: dto.moodType,
        note: dto.note,
        date: new Date(),
      },
    });
  }

  async update(userId: number, moodId: number, dto: UpdateMoodDto) {
    const mood = await this.prisma.mood.findUnique({
      where: { id: moodId },
    });

    if (!mood || mood.userId !== userId) {
      throw new BadRequestException('Invalid mood');
    }

    return this.prisma.mood.update({
      where: { id: moodId },
      data: {
        moodType: dto.moodType,
        note: dto.note,
      },
    });
  }

  async delete(userId: number, moodId: number) {
    const mood = await this.prisma.mood.findUnique({
      where: { id: moodId },
    });

    if (!mood || mood.userId !== userId) {
      throw new BadRequestException('Invalid mood');
    }

    return this.prisma.mood.delete({
      where: { id: moodId },
    });
  }

  async findByDate(userId: number, date: Date) {
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    return this.prisma.mood.findMany({
      where: { userId, date: { gte: start, lte: end } },
    });
  }
}
