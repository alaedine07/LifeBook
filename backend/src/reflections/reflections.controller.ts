import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { ReflectionsService } from './reflections.service';
import { CreateReflectionDto } from './dto/create-reflection.dto';
import { UpdateReflectionDto } from './dto/update-reflection.dto';

@Controller('reflections')
@UseGuards(AuthGuard('jwt'))
export class ReflectionsController {
  constructor(private reflectionsService: ReflectionsService) {}

  @Post()
  create(@Body() dto: CreateReflectionDto, @GetUser() user: User) {
    return this.reflectionsService.create(user.id, dto);
  }

  @Get()
  list(@GetUser() user: User) {
    console.log('Fetching reflections for user:', user.id);
    return this.reflectionsService.findByUser(user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReflectionDto,
    @GetUser() user: User,
  ) {
    return this.reflectionsService.update(user.id, parseInt(id, 10), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @GetUser() user: User) {
    return this.reflectionsService.delete(user.id, parseInt(id, 10));
  }
}
