import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { MoodsService } from './moods.service';
import { CreateMoodDto } from './dto/create-mood.dto';

@Controller('moods')
@UseGuards(AuthGuard('jwt'))
export class MoodsController {
  constructor(private moodsService: MoodsService) {}

  @Post()
  create(@Body() dto: CreateMoodDto, @GetUser() user: User) {
    return this.moodsService.create(user.id, dto);
  }

  @Get(':date')
  getByDate(@Param('date') date: string, @GetUser() user: User) {
    return this.moodsService.findByDate(user.id, new Date(date));
  }
}
