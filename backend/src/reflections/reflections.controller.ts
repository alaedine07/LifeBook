import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { ReflectionsService } from './reflections.service';
import { CreateReflectionDto } from './dto/create-reflection.dto';

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
    return this.reflectionsService.findByUser(user.id);
  }
}
