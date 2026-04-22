import { Module } from '@nestjs/common';
import { DailyAnswersService } from './daily-answers.service';
import { DailyAnswersController } from './daily-answers.controller';
import { PrismaService } from '../../prisma/prisma.service';


@Module({
  controllers: [DailyAnswersController],
  providers: [DailyAnswersService, PrismaService],
})
export class DailyAnswersModule {}
