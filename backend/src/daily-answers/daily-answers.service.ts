import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDailyAnswerDto } from './dto/create-daily-answer.dto';
import { UpdateDailyAnswerDto } from './dto/update-daily-answer.dto';

@Injectable()
export class DailyAnswersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateDailyAnswerDto) {
    const reflection = await this.prisma.reflection.findUnique({ where: { id: dto.reflectionId } });
    if (!reflection || reflection.userId !== userId) {
      throw new BadRequestException('Invalid reflection');
    }

    let data: any = { userId, reflectionId: dto.reflectionId, date: new Date() };
    switch (reflection.type) {
      case 'BOOLEAN':
        data.booleanAnswer = dto.booleanAnswer;
        break;
      case 'NUMBER':
        data.numberAnswer = dto.numberAnswer;
        break;
      case 'TEXT':
        data.textAnswer = dto.textAnswer;
        break;
    }

    return this.prisma.dailyAnswer.create({ data });
  }

  async update(userId: number, answerId: number, dto: UpdateDailyAnswerDto) {
    const dailyAnswer = await this.prisma.dailyAnswer.findUnique({
      where: { id: answerId },
      include: { reflection: true },
    });

    if (!dailyAnswer || dailyAnswer.userId !== userId) {
      throw new BadRequestException('Invalid answer');
    }

    const reflection = dailyAnswer.reflection;
    let updateData: any = {};

    switch (reflection.type) {
      case 'BOOLEAN':
        updateData.booleanAnswer = dto.booleanAnswer;
        break;
      case 'NUMBER':
        updateData.numberAnswer = dto.numberAnswer;
        break;
      case 'TEXT':
        updateData.textAnswer = dto.textAnswer;
        break;
    }

    return this.prisma.dailyAnswer.update({
      where: { id: answerId },
      data: updateData,
    });
  }

  async findByDate(userId: number, date: Date) {
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    return this.prisma.dailyAnswer.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: { reflection: true },
    });
  }
}
