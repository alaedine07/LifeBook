import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { TherapistsService } from './therapists.service';
import { AddMoodCommentDto } from './dto/add-mood-comment.dto';

@Controller('therapists/mood-comments')
@UseGuards(AuthGuard('jwt'))
export class MoodCommentsController {
  constructor(private therapistsService: TherapistsService) {}

  @Post(':moodId')
  addComment(
    @Param('moodId') moodId: string,
    @Body() dto: AddMoodCommentDto,
    @GetUser() user: User
  ) {
    return this.therapistsService.addMoodComment(user.id, parseInt(moodId), dto.comment);
  }

  @Get(':moodId')
  getComments(
    @Param('moodId') moodId: string,
    @GetUser() user: User
  ) {
    return this.therapistsService.getMoodComments(user.id, parseInt(moodId));
  }
}
