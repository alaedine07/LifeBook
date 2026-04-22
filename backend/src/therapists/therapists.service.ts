import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
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

  async getPatientDataRange(therapistId: number, patientId: number, from: Date, to: Date) {
    const link = await this.prisma.userTherapist.findFirst({
      where: { therapistId, userId: patientId },
    });
    if (!link) {
      throw new ForbiddenException('Access denied');
    }

    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);

    const answers = await this.prisma.dailyAnswer.findMany({
      where: { userId: patientId, date: { gte: start, lte: end } },
      include: { reflection: true },
      orderBy: { date: 'desc' },
    });
    const moods = await this.prisma.mood.findMany({
      where: { userId: patientId, date: { gte: start, lte: end } },
      orderBy: { date: 'desc' },
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

  async addReflectionComment(therapistId: number, answerId: number, comment: string | undefined) {
    // Verify the answer exists and get the userId
    const answer = await this.prisma.dailyAnswer.findUnique({
      where: { id: answerId },
      select: { userId: true },
    });

    if (!answer) {
      throw new BadRequestException('Answer not found');
    }

    // Verify therapist has access to this patient
    const access = await this.prisma.userTherapist.findFirst({
      where: { therapistId, userId: answer.userId },
    });

    if (!access) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    return this.prisma.reflectionComment.create({
      data: {
        therapistId,
        DailyAnswerId: answerId,
        comment : comment ?? '',
      },
    });
  }

  async getReflectionComments(userId: number, answerId: number) {
    // Verify the answer exists and get the userId
    const answer = await this.prisma.dailyAnswer.findUnique({
      where: { id: answerId },
      select: { userId: true },
    });

    if (!answer) {
      throw new BadRequestException('Answer not found');
    }

    // Allow access if:
    // 1. User is the owner of the answer, OR
    // 2. User is a therapist with access to this patient
    if (answer.userId !== userId) {
      const access = await this.prisma.userTherapist.findFirst({
        where: { therapistId: userId, userId: answer.userId },
      });

      if (!access) {
        throw new ForbiddenException('You do not have access to this answer');
      }
    }

    return this.prisma.reflectionComment.findMany({
      where: { DailyAnswerId: answerId },
      include: {
        therapist: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getMoodComments(userId: number, moodId: number) {
    // Verify the mood exists and get the userId
    const mood = await this.prisma.mood.findUnique({
      where: { id: moodId },
      select: { userId: true },
    });

    if (!mood) {
      throw new BadRequestException('Mood not found');
    }

    // Allow access if:
    // 1. User is the owner of the mood, OR
    // 2. User is a therapist with access to this patient
    if (mood.userId !== userId) {
      const access = await this.prisma.userTherapist.findFirst({
        where: { therapistId: userId, userId: mood.userId },
      });

      if (!access) {
        throw new ForbiddenException('You do not have access to this mood');
      }
    }

    return this.prisma.moodComment.findMany({
      where: {
        moodId,
      },
      include: {
        therapist: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async addMoodComment(
    therapistId: number,
    moodId: number,
    comment: string | undefined,
  ) {
    // Verify the mood exists and get the userId
    const mood = await this.prisma.mood.findUnique({
      where: { id: moodId },
      select: { userId: true },
    });

    if (!mood) {
      throw new BadRequestException('Mood not found');
    }

    // Verify therapist has access to this patient
    const access = await this.prisma.userTherapist.findFirst({
      where: { therapistId, userId: mood.userId },
    });

    if (!access) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    return this.prisma.moodComment.create({
      data: {
        moodId,
        therapistId,
        comment: comment ?? '',
      },
    });
  }

  async updateMoodComment(
    therapistId: number,
    commentId: number,
    comment: string | undefined,
  ) {
    // Verify the comment exists and belongs to the therapist
    const existingComment = await this.prisma.moodComment.findUnique({
      where: { id: commentId },
      select: { therapistId: true },
    });

    if (!existingComment) {
      throw new BadRequestException('Comment not found');
    }

    if (existingComment.therapistId !== therapistId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.prisma.moodComment.update({
      where: { id: commentId },
      data: { comment },
      include: {
        therapist: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async deleteMoodComment(therapistId: number, commentId: number) {
    // Verify the comment exists and belongs to the therapist
    const existingComment = await this.prisma.moodComment.findUnique({
      where: { id: commentId },
      select: { therapistId: true },
    });

    if (!existingComment) {
      throw new BadRequestException('Comment not found');
    }

    if (existingComment.therapistId !== therapistId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.moodComment.delete({
      where: { id: commentId },
    });
  }

  async updateReflectionComment(
    therapistId: number,
    commentId: number,
    comment: string | undefined,
  ) {
    // Verify the comment exists and belongs to the therapist
    const existingComment = await this.prisma.reflectionComment.findUnique({
      where: { id: commentId },
      select: { therapistId: true },
    });

    if (!existingComment) {
      throw new BadRequestException('Comment not found');
    }

    if (existingComment.therapistId !== therapistId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.prisma.reflectionComment.update({
      where: { id: commentId },
      data: { comment },
      include: {
        therapist: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
    });
  }

  async deleteReflectionComment(therapistId: number, commentId: number) {
    // Verify the comment exists and belongs to the therapist
    const existingComment = await this.prisma.reflectionComment.findUnique({
      where: { id: commentId },
      select: { therapistId: true },
    });

    if (!existingComment) {
      throw new BadRequestException('Comment not found');
    }

    if (existingComment.therapistId !== therapistId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.reflectionComment.delete({
      where: { id: commentId },
    });
  }
}
