import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMoodDto } from './dto/create-mood.dto';

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

  async findByDate(userId: number, date: Date) {
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    return this.prisma.mood.findMany({
      where: { userId, date: { gte: start, lte: end } },
    });
  }
}
