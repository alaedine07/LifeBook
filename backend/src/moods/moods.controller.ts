import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { MoodsService } from './moods.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';

@Controller('moods')
@UseGuards(AuthGuard('jwt'))
export class MoodsController {
  constructor(private moodsService: MoodsService) {}

  @Post()
  create(@Body() dto: CreateMoodDto, @GetUser() user: User) {
    console.log('Creating mood for user:', user.id, 'with data:', dto);
    return this.moodsService.create(user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMoodDto,
    @GetUser() user: User,
  ) {
    return this.moodsService.update(user.id, parseInt(id, 10), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @GetUser() user: User) {
    return this.moodsService.delete(user.id, parseInt(id, 10));
  }

  @Get('range/query')
  getByRange(
    @Query('from') from: string,
    @Query('to') to: string,
    @GetUser() user: User,
  ) {
    return this.moodsService.findByRange(user.id, new Date(from), new Date(to));
  }

  @Get(':date')
  getByDate(@Param('date') date: string, @GetUser() user: User) {
    return this.moodsService.findByDate(user.id, new Date(date));
  }
}
