import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { DailyAnswersService } from './daily-answers.service';
import { CreateDailyAnswerDto } from './dto/create-daily-answer.dto';

@Controller('daily-answers')
@UseGuards(AuthGuard('jwt'))
export class DailyAnswersController {
  constructor(private dailyAnswersService: DailyAnswersService) {}

  @Post()
  create(@Body() dto: CreateDailyAnswerDto, @GetUser() user: User) {
    return this.dailyAnswersService.create(user.id, dto);
  }

  @Get(':date')
  getByDate(@Param('date') date: string, @GetUser() user: User) {
    return this.dailyAnswersService.findByDate(user.id, new Date(date));
  }
}
