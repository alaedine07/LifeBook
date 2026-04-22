import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { DailyAnswersService } from './daily-answers.service';
import { CreateDailyAnswerDto } from './dto/create-daily-answer.dto';
import { UpdateDailyAnswerDto } from './dto/update-daily-answer.dto';

@Controller('daily-answers')
@UseGuards(AuthGuard('jwt'))
export class DailyAnswersController {
  constructor(private dailyAnswersService: DailyAnswersService) {}

  @Post()
  create(@Body() dto: CreateDailyAnswerDto, @GetUser() user: User) {
    return this.dailyAnswersService.create(user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDailyAnswerDto,
    @GetUser() user: User,
  ) {
    return this.dailyAnswersService.update(user.id, parseInt(id, 10), dto);
  }

  @Get('range/query')
  getByRange(
    @Query('from') from: string,
    @Query('to') to: string,
    @GetUser() user: User,
  ) {
    return this.dailyAnswersService.findByRange(user.id, new Date(from), new Date(to));
  }

  @Get(':date')
  getByDate(@Param('date') date: string, @GetUser() user: User) {
    return this.dailyAnswersService.findByDate(user.id, new Date(date));
  }
}
