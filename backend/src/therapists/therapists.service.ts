import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TherapistsService {
  constructor(private prisma: PrismaService, private usersService: UsersService) {}

  async addTherapist(userId: number, therapistEmail: string) {
    const therapist = await this.usersService.findByEmail(therapistEmail);
    if (!therapist || therapist.role !== 'THERAPIST') {
      throw new BadRequestException('Invalid therapist');
    }
    return this.prisma.userTherapist.create({
      data: { userId, therapistId: therapist.id },
    });
  }

  async getPatients(therapistId: number) {
    return this.prisma.userTherapist.findMany({
      where: { therapistId },
      include: { user: true },
    });
  }

  async getPatientData(therapistId: number, patientId: number, date: Date) {
    const link = await this.prisma.userTherapist.findFirst({
      where: { therapistId, userId: patientId },
    });
    if (!link) {
      throw new ForbiddenException('Access denied');
    }

    const answers = await this.prisma.dailyAnswer.findMany({
      where: { userId: patientId, date: { gte: date, lt: new Date(date.getTime() + 86400000) } },
      include: { reflection: true },
    });
    const moods = await this.prisma.mood.findMany({
      where: { userId: patientId, date: { gte: date, lt: new Date(date.getTime() + 86400000) } },
    });

    return { answers, moods };
  }

  async deleteTherapist(userId: number, therapistId: number) {
    const link = await this.prisma.userTherapist.findFirst({
      where: { userId, therapistId },
    });
    if (!link) {
      throw new BadRequestException('Therapist not found');
    }
    return this.prisma.userTherapist.delete({
      where: { id: link.id },
    });
  }

  async getTherapists(userId: number) {
    return this.prisma.userTherapist.findMany({
      where: { userId },
      include: { therapist: true },
    });
  }
}
